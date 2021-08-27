import websockets
import asyncio
import sys
import signal
import json
from types import FrameType, FunctionType
from typing import Any, Dict, cast

import pybullet as p
import time
# import math
import pybullet_data
import numpy as np

# Default to localhost if no cmdline argument is provided
uri = sys.argv[1] if len(sys.argv) >= 2 else "ws://localhost:64209/ws"

# General settings
name = "pybullet"
nickname = "Bullet Client"
version = "0.2.0"
service_name = "pybullet"
service_nickname = "Bullet Service"

# Runtime settings
uuid = None

# Target payload to the service.
service_target = {
    "type": "SERVICE",
    "service": service_name
}

async def send_msg(target: Dict[str, str], socket: websockets.WebSocketClientProtocol, data: Dict[str, Any]):
    """
    Utility method for sending message payloads to a target.
    """
    await socket.send(json.dumps({
        "type": "MESSAGE",
        "target": target,
        "data": data
    }))

async def chat_service():
    """
    Main method for starting the concierge bot.
    """
    global uri
    print("Connecting to the concierge.")
    async with websockets.connect(uri, subprotocols="ert-concierge") as socket:
        global uuid

        # Identify ourself.
        await socket.send(json.dumps({
            "type": "IDENTIFY",
            "name": name,
            "nickname": nickname,
            "version": version,
            "tags": ["service", "physics"]
        }))
        hello = json.loads(await socket.recv())

        # Expect that the first payload return to us is a HELLO payload.
        uuid = hello["uuid"]
        server_version = hello["version"]
        print(f"My uuid is {uuid}. The server version is {server_version}.")

        print("Creating group.")

        # Create our service.
        await socket.send(json.dumps({
            "type": "SERVICE_CREATE",
            "service": service_name,
            "nickname": service_nickname
        }))

        # Subscribe to our own service so we can receive the SERVICE_CLIENT_SUBSCRIBED
        # and SERVICE_CLIENT_UNSUBSCRIBED event payload.
        await socket.send(json.dumps({
            "type": "SELF_SUBSCRIBE",
            "service": service_name
        }))

        print("Starting service.")

        # p.connect(p.GUI)
        p.connect(p.DIRECT)
        p.setAdditionalSearchPath(pybullet_data.getDataPath())
        p.setPhysicsEngineParameter(numSolverIterations=10)
        p.setTimeStep(1. / 120.)
        logId = p.startStateLogging(p.STATE_LOGGING_PROFILE_TIMINGS, "visualShapeBench.json")
        #useMaximalCoordinates is much faster then the default reduced coordinates (Featherstone)
        p.loadURDF("plane100.urdf", useMaximalCoordinates=True)
        #disable rendering during creation.
        p.configureDebugVisualizer(p.COV_ENABLE_RENDERING, 0)
        p.configureDebugVisualizer(p.COV_ENABLE_GUI, 0)
        #disable tinyrenderer, software (CPU) renderer, we don't use it here
        p.configureDebugVisualizer(p.COV_ENABLE_TINY_RENDERER, 0)

        shift = [0, -0.02, 0]
        meshScale = [0.1, 0.1, 0.1]

        # visualShapeId = p.createVisualShape(shapeType=p.GEOM_MESH,
        #                                     fileName="duck.obj",
        #                                     rgbaColor=[1, 1, 1, 1],
        #                                     specularColor=[0.4, .4, 0],
        #                                     visualFramePosition=shift,
        #                                     meshScale=meshScale)
        # collisionShapeId = p.createCollisionShape(shapeType=p.GEOM_MESH,
        #                                         fileName="duck_vhacd.obj",
        #                                         collisionFramePosition=shift,
        #                                         meshScale=meshScale)

        # multiDuckId = p.createMultiBody(baseMass=1,
        #                 baseInertialFramePosition=[0, 0, 0],
        #                 baseCollisionShapeIndex=collisionShapeId,
        #                 baseVisualShapeIndex=visualShapeId,
        #                 basePosition=[(1/2) * meshScale[0] * 2,
        #                             (1/2) * meshScale[1] * 2, 1],
        #                 useMaximalCoordinates=True)

        ballVisualId = p.createVisualShape(shapeType=p.GEOM_SPHERE,
                                            radius=0.15,
                                            rgbaColor=[1, 1, 1, 1],
                                            specularColor=[0.4, .4, 0],
                                            visualFramePosition=shift,
                                            meshScale=meshScale)
        ballCollisionId = p.createCollisionShape(shapeType=p.GEOM_SPHERE,
                                                  radius=0.15,
                                                  collisionFramePosition=shift,
                                                  meshScale=meshScale)

        p.createMultiBody(baseMass=1,
                        baseInertialFramePosition=[0, 0, 0],
                        baseCollisionShapeIndex=ballCollisionId,
                        baseVisualShapeIndex=ballVisualId,
                        basePosition=[(1/2) * meshScale[0] * 2,
                                    (1/2) * meshScale[1] * 2, 2],
                        useMaximalCoordinates=True)

        rampVisualId = p.createVisualShape(shapeType=p.GEOM_BOX,
                                            halfExtents=[1, 1, 0.1],
                                            rgbaColor=[1, 1, 1, 1],
                                            specularColor=[0.4, .4, 0],
                                            visualFramePosition=shift,
                                            meshScale=meshScale)
        rampCollisionId = p.createCollisionShape(shapeType=p.GEOM_BOX,
                                                halfExtents=[1, 1, 0.1],
                                                collisionFramePosition=shift,
                                                meshScale=meshScale)

        p.createMultiBody(baseMass=0,
                        baseInertialFramePosition=[0, 0, 0],
                        baseCollisionShapeIndex=rampCollisionId,
                        baseVisualShapeIndex=rampVisualId,
                        basePosition=[(1/2) * meshScale[0] * 2,
                                    (1/2) * meshScale[1] * 2, 1],
                        baseOrientation=[np.sin(np.pi/20), 0, np.cos(np.pi/20), 0],
                        useMaximalCoordinates=True)


        p.configureDebugVisualizer(p.COV_ENABLE_RENDERING, 1)
        p.stopStateLogging(logId)
        p.setRealTimeSimulation(1)

        colors = [[1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1], [1, 1, 1, 1]]
        currentColor = 0

        while (p.isConnected()):
            time.sleep(1./120.)
            p.setGravity(0, 0, -10)
            print(p.getBasePositionAndOrientation(bodyUniqueId=multiDuckId))
            await send_msg(service_target, socket, {
                        "type": "TEXT",
                        # "author": "lol",
                        # "author_uuid": payload["origin"]["uuid"],
                        "text": str(p.getBasePositionAndOrientation(bodyUniqueId=multiDuckId))
                    })

        # Start the socket receiving loop.
        # await recv_loop(socket)


        print("Disconnecting and stopping service.")

async def recv_loop(socket: websockets.WebSocketClientProtocol):
    """
    Incoming message loop. Nothing very special about it.
    """
    async for msg in socket:
        payload = json.loads(msg)
        try:
            await handle_payload(payload, socket)
        except Exception as e:
            print("Uncaught exception", e)

async def handle_payload(payload: Dict[str, Any], socket: websockets.WebSocketClientProtocol):
    """
    Handle one payload.
    """
    return


