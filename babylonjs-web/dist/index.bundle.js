!function(e){function t(t){for(var n,r,a=t[0],l=t[1],c=t[2],h=0,u=[];h<a.length;h++)r=a[h],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&u.push(i[r][0]),i[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(d&&d(t);u.length;)u.shift()();return o.push.apply(o,c||[]),s()}function s(){for(var e,t=0;t<o.length;t++){for(var s=o[t],n=!0,a=1;a<s.length;a++){var l=s[a];0!==i[l]&&(n=!1)}n&&(o.splice(t--,1),e=r(r.s=s[0]))}return e}var n={},i={0:0},o=[];function r(t){if(n[t])return n[t].exports;var s=n[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=n,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var a=window.webpackJsonp=window.webpackJsonp||[],l=a.push.bind(a);a.push=t,a=a.slice();for(var c=0;c<a.length;c++)t(a[c]);var d=l;o.push([6,2]),s()}([,,function(e,t){e.exports=BABYLON},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ServiceEventHandler=t.EventHandler=void 0;class n{onReceive(e){var t,s,n,i,o,r,a;switch(e.type){case"MESSAGE":null===(t=this.onRecvMessage)||void 0===t||t.call(this,e);break;case"HELLO":null===(s=this.onRecvHello)||void 0===s||s.call(this,e);break;case"GROUP_SUBSCRIBERS":null===(n=this.onRecvGroupSubs)||void 0===n||n.call(this,e);break;case"GROUPS":null===(i=this.onRecvGroupList)||void 0===i||i.call(this,e);break;case"CLIENTS":null===(o=this.onRecvClientList)||void 0===o||o.call(this,e);break;case"SUBSCRIPTIONS":null===(r=this.onRecvSubscriptions)||void 0===r||r.call(this,e);break;case"STATUS":null===(a=this.onRecvStatus)||void 0===a||a.call(this,e)}}}t.EventHandler=n;t.ServiceEventHandler=class extends n{constructor(e,t){super(),this.subscribed=!1,this.client=e,this.group=t}onClose(e){this.onUnsubscribe()}onRecvHello(e){this.client.sendJSON({type:"FETCH_GROUP_SUBSCRIBERS",group:this.group})}onRecvGroupSubs(e){e.group==this.group&&this.subscribe(this.group)}subscribe(e){this.client.sendJSON({type:"SUBSCRIBE",group:e})}onRecvStatus(e){switch(e.code){case"NO_SUCH_GROUP":e.group==this.group&&console.error("Group `",this.group,"` does not exist on concierge.");break;case"GROUP_DELETED":e.group==this.group&&console.warn("Group `",this.group,"` has been deleted on the concierge.");break;case"GROUP_CREATED":e.group==this.group&&this.subscribe(this.group);break;case"SUBSCRIBED":e.group==this.group&&(console.log("Subscribed to `",this.group,"`."),this.subscribed=!0,this.onSubscribe());break;case"UNSUBSCRIBED":e.group==this.group&&(console.log("Unsubscribed from `",this.group,"`."),this.subscribed=!1,this.onUnsubscribe())}}}},,,function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=s(7),i=s(8),o=s(9),r=s(10),a=s(11),l=s(12),c=s(13),d=new URLSearchParams(window.location.search);let h=d.get("server")||"ws://127.0.0.1:64209/ws";if(!h||0==h.length)throw alert("Malformed server URL.");let u=d.get("name");for(;!u||0==u.length;)u=prompt("Please enter your name");let p=document.querySelector("canvas#renderCanvas");if(!p)throw"Canvas is not found!";p.focus();let g=new l.Renderer(p),b=(new c.Window.UI(document.querySelector(".window#chat-window")),new c.Window.UI(document.querySelector(".window#control-window")),new n.Client(u,h,!0)),w=new i.PhysicsHandler(b,g);b.handlers.push(w);let f=new r.PlanetsHandler(b,g);b.handlers.push(f);let m=new c.Chat.UI(document.querySelector("#chat")),v=new o.ChatHandler(b,m);b.handlers.push(v);let y=new c.Sidebar.UI(document.querySelector(".sidebar#users")),x=new a.UsersHandler(b,y);b.handlers.push(x),g.start(),b.connect("0.1.0")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Client=void 0;class n{constructor(e,t,s=!1){this.seq=0,this.reconnectInterval=1e4,this.handlers=[],this.url=t,this.name=e,this.reconnect=s}connect(e,t){console.info("Trying to connect to ",this.url),this.version=e,this.secret=t,this.socket=new WebSocket(this.url),this.socket.onopen=e=>this.onOpen(e),this.socket.onmessage=e=>this.onReceive(e),this.socket.onerror=e=>this.onError(e),this.socket.onclose=e=>this.onClose(e)}sendJSON(e){if(null==this.socket)throw new Error("Socket is not connected");this.socket.send(JSON.stringify(e));let t=this.seq;return this.seq+=1,t}close(e,t,s=!0){if(null==this.socket)throw new Error("Socket is not connected");this.socket.close(e,t),s?this.tryReconnect():(this.socket=void 0,this.version=void 0,this.secret=void 0)}tryReconnect(){this.reconnect&&(console.warn("Connection closed, reconnecting in",this.reconnectInterval,"ms"),setTimeout(()=>{this.connect(this.version,this.secret)},this.reconnectInterval))}onOpen(e){var t;for(let s of this.handlers)null===(t=s.onOpen)||void 0===t||t.call(s,e);if(null==this.version)throw new Error("Version is undefined");console.log("Identifying with version",this.version),this.sendJSON({type:"IDENTIFY",name:this.name,version:this.version,secret:this.secret,tags:["babylon"]})}onClose(e){var t;for(let s of this.handlers)null===(t=s.onClose)||void 0===t||t.call(s,e);console.warn(e.code,e.reason),this.tryReconnect()}onReceive(e){var t;let s=JSON.parse(e.data);if(s.hasOwnProperty("type")){let e=s;"HELLO"==e.type&&(this.uuid=e.uuid,this.seq=0);for(let s of this.handlers)null===(t=s.onReceive)||void 0===t||t.call(s,e)}}onError(e){var t;for(let s of this.handlers)null===(t=s.onError)||void 0===t||t.call(s,e);console.log(e)}}t.Client=n,t.default=n},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PhysicsHandler=t.PHYSICS_ENGINE_GROUP=t.PHYSICS_ENGINE_NAME=void 0;const n=s(2),i=s(3);function o(e){return new n.Vector2(e.x,e.y)}function r(e){function t(e){return Math.max(0,Math.min(e,255))/255}return new n.Color3(t(e[0]),t(e[1]),t(e[2]))}t.PHYSICS_ENGINE_NAME="physics_engine",t.PHYSICS_ENGINE_GROUP="physics_engine_out";class a{constructor(e,t){this.centroid=e,this.mesh=t}static createPolygon(e,t,s,i,o=1){let r=t.map(e=>e.scaleInPlace(o)),l=new n.PolygonMeshBuilder("polytri",r,s).build(void 0,50*o);l.position.y+=50*o;var c=new n.StandardMaterial("myMaterial",s);return c.diffuseColor=i,l.material=c,l.actionManager=new n.ActionManager(s),new a(e.scaleInPlace(o),l)}setColor(e){this.mesh.material.diffuseColor=e}moveTo(e){let t=e.subtract(this.centroid);this.mesh.position.addInPlace(t),this.centroid.set(e.x,e.y,e.z)}}class l extends i.ServiceEventHandler{constructor(e,s){super(e,t.PHYSICS_ENGINE_GROUP),this.scale=1,this.client=e,this.renderer=s,this.shapes=new Map}onRecvMessage(e){e.origin.name==t.PHYSICS_ENGINE_NAME&&this.processPhysicsPayload(e.data)}onSubscribe(){console.log("Fetching..."),this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PHYSICS_ENGINE_NAME},data:{type:"FETCH_ENTITIES"}})}onUnsubscribe(){this.clearShapes()}clearShapes(){var e;for(let t of this.shapes.keys())if(this.shapes.has(t)){let s=this.shapes.get(t);null===(e=this.renderer.shadowGenerator)||void 0===e||e.removeShadowCaster(s.mesh),s.mesh.dispose(),this.shapes.delete(t)}}createPolygon(e,t,s,i){var o;if(this.renderer.scene){let r=a.createPolygon(new n.Vector3(t.x,0,t.y),s,this.renderer.scene,i,this.scale);return this.shapes.set(e,r),null===(o=this.renderer.shadowGenerator)||void 0===o||o.addShadowCaster(r.mesh),r}throw new Error("Scene not initialized!")}createShape(e,s,i,a){let l=o(s),c=i.map(o),d=r(a);this.createPolygon(e,l,c,d).mesh.actionManager.registerAction(new n.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,()=>{console.log("Clicking on object ",e,"."),this.client.sendJSON({type:"MESSAGE",target:{type:"NAME",name:t.PHYSICS_ENGINE_NAME},data:{type:"TOGGLE_COLOR",id:e}})}))}updateShape(e,t){let s=this.shapes.get(e);s&&s.moveTo(new n.Vector3(t.x,0,t.y).scaleInPlace(this.scale))}updateColor(e,t){let s=this.shapes.get(e);s&&s.setColor(r(t))}processPhysicsPayload(e){switch(e.type){case"ENTITY_DUMP":console.log("Dumping entities!"),this.clearShapes();for(let t of e.entities)this.createShape(t.id,t.centroid,t.points,t.color);break;case"POSITION_DUMP":for(let t of e.updates)this.updateShape(t.id,t.position);break;case"COLOR_UPDATE":this.updateColor(e.id,e.color)}}}t.PhysicsHandler=l},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ChatHandler=void 0;const n=s(3);class i extends n.ServiceEventHandler{constructor(e,t){super(e,"chat"),this.client=e,this.ui=t,t.onEnter=e=>{this.onEnter(e)}}onSubscribe(){this.ui.addStatus("Connected to the chat system.")}onEnter(e){this.client.sendJSON({type:"MESSAGE",target:{type:"GROUP",group:"chat"},data:e})}onRecvMessage(e){e.origin&&"chat"==e.origin.group&&"string"==typeof e.data&&this.ui.addMessage(e.origin.name,e.data,e.origin.name==this.client.name)}onUnsubscribe(){this.ui.addStatus("Disconnected from the chat system.")}}t.ChatHandler=i},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PlanetsHandler=t.PLANET_SIM_GROUP=t.PLANET_SIM_NAME=void 0;const n=s(2),i=s(3);t.PLANET_SIM_NAME="planetary_simulation",t.PLANET_SIM_GROUP="planetary_simulation_out";class o{constructor(e,t){this.centroid=e,this.mesh=t}static createSphere(e,t,s,i,r=1){let a=n.MeshBuilder.CreateSphere("mySphere",{diameter:2*t*r},s);a.position=e;var l=new n.StandardMaterial("myMaterial",s);return l.diffuseColor=i,a.material=l,a.actionManager=new n.ActionManager(s),new o(e,a)}setColor(e){this.mesh.material.diffuseColor=e}moveTo(e){let t=e.subtract(this.centroid);this.mesh.position.addInPlace(t),this.centroid.set(e.x,e.y,e.z)}}class r extends i.ServiceEventHandler{constructor(e,s){super(e,t.PLANET_SIM_GROUP),this.client=e,this.renderer=s,this.planets=new Map}onRecvMessage(e){e.origin.name==t.PLANET_SIM_NAME&&this.processPhysicsPayload(e.data)}onSubscribe(){}onUnsubscribe(){this.clearShapes()}clearShapes(){var e;for(let t of this.planets.keys())if(this.planets.has(t)){let s=this.planets.get(t);null===(e=this.renderer.shadowGenerator)||void 0===e||e.removeShadowCaster(s.mesh),s.mesh.dispose(),this.planets.delete(t)}}processPhysicsPayload(e){var t;this.sysData=e.systemData;for(let s of e.objects){let e=new n.Vector3(s.locationX,s.locationY,s.locationZ).scaleInPlace(1/this.sysData.scale).scaleInPlace(500);if(this.planets.has(s.name))this.planets.get(s.name).moveTo(e);else{if(!this.renderer.scene)throw new Error("Scene not initialized!");{let i=s.radius/this.sysData.scale*this.sysData.bodyScale*500,r=n.Color3.Black();s.name==this.sysData.centralBodyName&&(console.log("Found central body!"),i*=this.sysData.centralBodyScale,e.scaleInPlace(this.sysData.centralBodyScale),r=n.Color3.Yellow()),console.log(`Creating object (radius = ${i}, location = ${e.toString()})`);let a=o.createSphere(e,i,this.renderer.scene,r);this.planets.set(s.name,a),null===(t=this.renderer.shadowGenerator)||void 0===t||t.addShadowCaster(a.mesh)}}}}}t.PlanetsHandler=r},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UsersHandler=void 0;const n=s(3);class i extends n.EventHandler{constructor(e,t){super(),this.client=e,this.ui=t}onRecvHello(e){this.client.sendJSON({type:"FETCH_CLIENTS"})}onRecvClientList(e){this.ui.clear();for(let t of e.clients)this.ui.addInitialIcon(t.name,t.name[0])}onRecvStatus(e){switch(e.code){case"CLIENT_JOINED":this.ui.addInitialIcon(e.name,e.name[0]);break;case"CLIENT_LEFT":this.ui.removeIcon(e.name)}}}t.UsersHandler=i},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Renderer=void 0;const n=s(2),i=s(2);t.Renderer=class{constructor(e){this.canvas=e,this.engine=new n.Engine(e,!0)}createScene(){this.scene&&this.scene.dispose();let e=new n.Scene(this.engine),t=new n.UniversalCamera("UniversalCamera",new i.Vector3(500,800,-100),e);t.setTarget(new i.Vector3(500,0,500)),t.speed=15,t.attachControl(this.canvas,!0),t.keysDownward.push(17),t.keysUpward.push(32),t.keysUp.push(87),t.keysDown.push(83),t.keysLeft.push(65),t.keysRight.push(68);let s=new n.PointLight("light1",new n.Vector3(500,500,500),e);s.intensity=1;let o=e.createDefaultEnvironment({skyboxSize:1050,groundSize:1050,groundShadowLevel:.5,enableGroundShadow:!0});o.ground.position.set(500,0,500),o.skybox.position.set(500,0,500),o.skybox.isPickable=!1,o.setMainColor(n.Color3.FromHexString("#74b9ff")),this.shadowGenerator=new n.ShadowGenerator(512,s),e.createDefaultVRExperience({createDeviceOrientationCamera:!1}).enableTeleportation({floorMeshes:[o.ground]}),this.scene=e}start(){null==this.scene&&this.createScene();let e=()=>{this.scene?this.scene.render():this.engine.stopRenderLoop(e)};this.engine.runRenderLoop(e),window.addEventListener("resize",()=>{this.engine.resize()})}stop(){this.engine.stopRenderLoop()}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Window=t.Sidebar=t.Chat=void 0;const n=s(14);t.Chat=n.default;const i=s(17);t.Sidebar=i.default;const o=s(22);t.Window=o.default},function(e,t,s){"use strict";function n(e,t=[]){let s=document.createElement(e);return s.classList.add(...t),s}var i;Object.defineProperty(t,"__esModule",{value:!0}),t.Chat=void 0,s(15),function(e){e.UI=class{constructor(e){this.messages=[],this.rootElement=e,this.setup()}setup(){let e=this.rootElement.querySelector("div.messages")||n("div",["messages"]),t=n("div",["input"]),s=n("input");t.appendChild(s);let i=n("div",["button"]);t.appendChild(i),s.addEventListener("keyup",e=>{13===e.keyCode&&(e.preventDefault(),i.click())}),i.addEventListener("click",e=>{var t;s.value.length>0&&(null===(t=this.onEnter)||void 0===t||t.call(this,s.value),s.value="")}),this.messagesElement=e,this.rootElement.appendChild(e),this.rootElement.appendChild(t)}createMessageElement(e,t,s=!1){let i=n("div",s?["entry","you"]:["entry"]),o=n("div",["name"]);o.innerText=e;let r=n("div",["text"]);return r.innerText=t,i.appendChild(o),i.appendChild(r),i}createStatusElement(e){let t=n("div",["entry","status"]),s=n("div",["text"]);return s.innerText=e,t.appendChild(s),t}addStatus(e){let t=this.createStatusElement(e);this.messagesElement.appendChild(t)}addMessage(e,t,s=!1){let n=this.createMessageElement(e,t,s);this.messagesElement.appendChild(n),this.messages.push({name:e,text:t,element:n})}}}(i=t.Chat||(t.Chat={})),t.default=i},function(e,t,s){var n=s(0),i=s(16);"string"==typeof(i=i.__esModule?i.default:i)&&(i=[[e.i,i,""]]);var o={insert:"head",singleton:!1};n(i,o);e.exports=i.locals||{}},function(e,t,s){(t=s(1)(!1)).push([e.i,"#chat{background:#111;color:#fff;height:100%;display:flex;flex-direction:column;font-family:monospace}#chat .input{position:relative;background:#444;display:flex;width:100%;height:0px;bottom:50px;padding-left:10px;padding-right:10px;box-sizing:border-box}#chat .input input{background:#444;color:#fff;border:0;padding:5px;box-sizing:border-box;height:40px;width:100%;border-radius:5px 0 0 5px;outline:none;font-family:monospace}#chat .input .button{line-height:40px;text-align:center;height:40px;width:40px;border-radius:0 5px 5px 0;background:green;user-select:none;cursor:pointer}#chat .input .button:hover{background:#3a3}#chat .messages{padding:15px;height:100%;width:100%;box-sizing:border-box;display:flex;flex-direction:column;position:relative;overflow:auto}#chat .messages::-webkit-scrollbar{width:10px}#chat .messages::-webkit-scrollbar-track{background:transparent}#chat .messages::-webkit-scrollbar-thumb{background:#444;border-radius:5px}#chat .messages::-webkit-scrollbar-thumb:hover{background:#555}#chat .messages .entry{display:flex;max-width:90%;flex-direction:column;align-self:flex-start}#chat .messages .entry:last-child{margin-bottom:40px}#chat .messages .entry.you{align-self:flex-end}#chat .messages .entry.you .name{text-align:right}#chat .messages .entry.you .text{border-radius:5px 0px 5px 5px;align-self:flex-end}#chat .messages .entry.status{width:100%;max-width:100%}#chat .messages .entry.status .text{text-align:center;background:none;margin:0;padding:0;color:#888}#chat .messages .entry .name{text-align:left;margin:10px 10px 0px}#chat .messages .entry .text{border-radius:0 5px 5px;background:#333;padding:10px;word-break:break-all;margin:5px}",""]),e.exports=t},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Sidebar=void 0,s(18);const n=s(25);function i(e,t=[]){let s=document.createElement(e);return s.classList.add(...t),s}var o;s(20),function(e){class t{constructor(e,t,s){this.name=e,this.element=t,this.tooltip=s}destroy(){this.element.remove(),this.tooltip.destroy()}}e.Icon=t;e.UI=class{constructor(e){this.icons=[],this.rootElement=e}baseIcon(){return i("div",["icon"])}clear(){for(let e of this.icons)e.destroy();this.icons.length=0}addImageIcon(e,s){let o=this.baseIcon(),r=n.default(o,{placement:"right",content:e}),a=i("img");a.setAttribute("src",s),o.appendChild(a),this.rootElement.appendChild(o),this.icons.push(new t(e,o,r))}addInitialIcon(e,s){let o=this.baseIcon(),r=n.default(o,{placement:"right",content:e}),a=i("p");a.innerText=s.toUpperCase(),o.appendChild(a),this.rootElement.appendChild(o),this.icons.push(new t(e,o,r))}removeIcon(e){for(let t=0;t<this.icons.length;t++){let s=this.icons[t];s.name==e&&(s.destroy(),this.icons.splice(t,1))}}}}(o=t.Sidebar||(t.Sidebar={})),t.default=o},function(e,t,s){var n=s(0),i=s(19);"string"==typeof(i=i.__esModule?i.default:i)&&(i=[[e.i,i,""]]);var o={insert:"head",singleton:!1};n(i,o);e.exports=i.locals||{}},function(e,t,s){(t=s(1)(!1)).push([e.i,'.sidebar{position:fixed;z-index:100;top:0;left:0;flex-direction:column;display:flex;overflow:auto;width:70px;height:100%;padding:15px}.sidebar::-webkit-scrollbar{width:5px}.sidebar::-webkit-scrollbar-track{background:transparent}.sidebar::-webkit-scrollbar-thumb{background:#444;border-radius:5px}.sidebar::-webkit-scrollbar-thumb:hover{background:#555}.sidebar .icon{flex:0 0 auto;width:70px;height:70px;margin-bottom:10px;box-sizing:border-box;position:relative}.sidebar .icon:hover .tooltip{visibility:visible;opacity:1}.sidebar .icon .tooltip{background-color:#555;border-radius:5px;color:#fff;font-family:monospace;margin-left:-10px;margin-top:5px;opacity:0;padding:5px 0;position:absolute;text-align:center;transition:opacity .2s;visibility:hidden;width:calc(100% + 20px);word-break:break-all;z-index:101}.sidebar .icon .tooltip::after{content:"";position:absolute;bottom:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:transparent transparent #555 transparent}.sidebar .icon img,.sidebar .icon p{height:100%;width:100%;background:#000;border-radius:50%;cursor:pointer;transition:border-radius .2s}.sidebar .icon img:hover,.sidebar .icon p:hover{border-radius:10px}.sidebar .icon p{color:#fff;line-height:70px;text-align:center;font-size:40px;font-family:sans-serif;user-select:none}.tippy-box{font-family:monospace !important}',""]),e.exports=t},,,function(e,t,s){"use strict";function n(e,t=[]){let s=document.createElement(e);return s.classList.add(...t),s}var i;Object.defineProperty(t,"__esModule",{value:!0}),t.Window=void 0,s(23),function(e){class t{constructor(e,t,s){this.tag=e,this.header=t,this.body=s}show(e=!0){e?(this.header.classList.add("active"),this.body.classList.add("active")):(this.header.classList.remove("active"),this.body.classList.remove("active"))}}e.Tab=t;e.UI=class{constructor(e){this.tabs=new Map,this.rootElement=e,this.headerElement=e.querySelector(".header")||n("div",["header"]),this.rootElement.prepend(this.headerElement),this.drawerElement=this.headerElement.querySelector(".window-drawer")||n("div",["window-drawer"]),this.headerElement.prepend(this.drawerElement),this.drawerElement.addEventListener("click",()=>{this.toggle()}),this.bodyElement=e.querySelector(".body")||n("div",["body"]),this.rootElement.append(this.bodyElement),this.bodyElement.querySelectorAll(".tab").forEach((e,t)=>{let s=e.getAttribute("tag");if(s){let n=e.getAttribute("label")||s;this.registerTab(s,n,e).show(0==t)}})}registerTab(e,s,i){let o=n("div",["tab"]);o.innerText=s,this.headerElement.appendChild(o);let r=new t(e,o,i);return this.tabs.set(e,r),o.addEventListener("click",()=>{this.show(!0),this.showTab(e)}),r}showTab(e){for(let[t,s]of this.tabs)s.show(t==e)}toggle(){this.rootElement.classList.toggle("hidden")}show(e){e?this.rootElement.classList.remove("hidden"):this.rootElement.classList.add("hidden")}}}(i=t.Window||(t.Window={})),t.default=i},function(e,t,s){var n=s(0),i=s(24);"string"==typeof(i=i.__esModule?i.default:i)&&(i=[[e.i,i,""]]);var o={insert:"head",singleton:!1};n(i,o);e.exports=i.locals||{}},function(e,t,s){(t=s(1)(!1)).push([e.i,".window{z-index:100;position:fixed;display:flex;bottom:0;width:400px;height:500px;max-height:100%;padding:5px;box-sizing:border-box;transition:margin-left .5s,margin-bottom .5s;flex-direction:column}.window.left{left:0}.window.right{right:0}.window.right .header{flex-direction:row-reverse}@media screen and (max-width: 500px){.window{bottom:0;height:50vh;width:100vw}}.window.hidden{margin-bottom:calc( max( -500px + 45px, -100vh + 45px ) )}@media screen and (max-width: 500px){.window.hidden{bottom:0;margin-left:0;margin-bottom:calc(-50vh + 45px)}}.window .header{min-height:40px;height:40px;max-height:40px;margin-left:5px;margin-right:5px;display:flex;flex-direction:row;overflow-x:auto;overflow-y:hidden;width:auto}.window .header .tab,.window .header .window-drawer{margin-top:5px;display:inline;max-height:40px;background:#222;line-height:40px;border-radius:5px 5px 0 0;text-align:center;padding:0px 10px 0px;color:#fff;font-family:monospace;cursor:pointer;transition:background-color .2s,margin-top .2s}.window .header .tab.active,.window .header .active.window-drawer{margin-top:0;background:#555}.window .header .window-drawer{margin-top:0;background:green;min-width:80px;width:80px;max-width:80px;padding:0}.window .body{background:#fff;height:100%;width:100%;border-radius:5px;overflow:hidden;color:#000}.window .body .tab,.window .body .header .window-drawer,.window .header .body .window-drawer{height:100%;width:100%;display:none}.window .body .tab.active,.window .body .header .active.window-drawer,.window .header .body .active.window-drawer{display:inherit}",""]),e.exports=t}]);