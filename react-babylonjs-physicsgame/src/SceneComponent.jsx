// import { Engine, Scene } from "@babylonjs/core";
// import React, { useEffect, useRef } from "react";

// export default (props) => {
//   const reactCanvas = useRef(null);
//   const { antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;

//   useEffect(() => {
//     if (reactCanvas.current) {
//       const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
//       const scene = new Scene(engine, sceneOptions);
//       if (scene.isReady()) {
//         props.onSceneReady(scene);
//       } else {
//         scene.onReadyObservable.addOnce((scene) => props.onSceneReady(scene));
//       }

//       engine.runRenderLoop(() => {
//         if (typeof onRender === "function") {
//           onRender(scene);
//         }
//         scene.render();
//       });

//       const resize = () => {
//         scene.getEngine().resize();
//       };

//       if (window) {
//         window.addEventListener("resize", resize);
//       }

//       return () => {
//         scene.getEngine().dispose();

//         if (window) {
//           window.removeEventListener("resize", resize);
//         }
//       };
//     }
//   }, [reactCanvas]);

//   return <canvas ref={reactCanvas} {...rest} />;
// };

import React from "react";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import "./App.css";

let box;

const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
  </div>
);
