import logo from './logo.svg';
import './App.css';
// import React from 'react';

import * as React from "react";
import * as BABYLON from "babylonjs";
import BabylonScene, {SceneEventArgs} from "./SceneComponent";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

class App extends React.Component<{}, {}> {

    onSceneMount = (e: SceneEventArgs) => {
        const {canvas, scene, engine} = e;

        var camera = new BABYLON.FreeCamera(
            "camera1",
            new BABYLON.Vector3(0, 5, -10),
            scene
        );

        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        var light = new BABYLON.HemisphericLight(
            "light1",
            new BABYLON.Vector3(0, 1, 1),
            scene
        )

        light.intensity = 0.7;
        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        sphere.position.y = 1;
        var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
    };

  constructor(props) {
    super(props);
    this.state = {value: '', objDict: {}, curr: 'none',
                  xpos: '', ypos: '', zpos: '', name: ''};
    this.handlexChange = this.handlexChange.bind(this);
    this.handleyChange = this.handleyChange.bind(this);
    this.handlezChange = this.handlezChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlexChange(event) {    this.setState({xpos: event.target.value});   }
  handleyChange(event) {    this.setState({ypos: event.target.value});   }
  handlezChange(event) {    this.setState({zpos: event.target.value});   }
  handleNameChange(event) {     this.setState({name: event.target.value})    };

  handleSubmit(event) {
    event.preventDefault();
    this.move("");
    this.rename();
  }

  createObj = (obj) => {
    if ("WebSocket" in window) {

      var defaultpos = "<249,136,3>";
      var group = "&group=Virtech&password=F2h6JyzlEH";
      var item = "&item=";
      var ws = new WebSocket("ws://localhost:8088/Virtech/F2h6JyzlEH/local,message");    
      
      ws.onopen = function() {
        if (obj == "plank") { item += "%2FMy+Inventory%2FObjects%2FPlank"; }
        if (obj == "ball") { item += "%2FMy+Inventory%2FObjects%2FBall"; }
        if (obj == "bucket") { item += "%2FMy+Inventory%2FObjects%2FBucket"; }
        if (obj == "plane") { item += "%2FMy+Inventory%2FObjects%2FPlane"; }

        ws.send("command=rez"+group+"&position="+defaultpos+item);
      }
      ws.onmessage = (evt) => {

        var data = evt.data;
        console.log(data);

        var arr = data.split("data=");
        var arr2 = arr[1].split("&success=");
        var UUID = arr2[0];

        var objDictlol = this.state.objDict;
        var num = this.findNum(obj);
        objDictlol[UUID] = {'type': obj, 'position': defaultpos, 'name':obj+" "+num};
        this.setState({objDict: objDictlol});
        this.setPermissions(UUID);
        // this.state.objDict[UUID] = {'type': obj, 'position': defaultpos};
        // ws.send("command=setobjectpermissions"+group+"&item="+UUID+permissions);      
     };
     ws.onclose = function() { 
        alert("Connection is closed..."); 
     };
  } else {
     alert("WebSocket NOT supported by your Browser!");
      } 
    }

    setPermissions = (UUID) => {
      if ("WebSocket" in window) {
      var group = "&group=Virtech&password=F2h6JyzlEH";
      var permissions = "&permissions=c%2D%2Dmvtc%2D%2Dmvtc%2D%2Dmvtc%2D%2Dmvtc%2D%2Dmvt";
      // var permissions = "&permissions=cdemvtcdemvtcdemvtcdemvtcdemvt";
      var ws = new WebSocket("ws://localhost:8088/Virtech/F2h6JyzlEH/local,message");    
      ws.onopen = function() {
        ws.send("command=setobjectpermissions"+group+"&item="+UUID+permissions);
      }
      ws.onmessage = (evt) => {
        // var data = evt.data;
        // console.log(data);    
     };
     ws.onclose = function() { 
        alert("Connection is closed..."); 
     };
  } else {
     alert("WebSocket NOT supported by your Browser!");
      } 
    }

    move = (dir) => {
      const item = this.state.curr;
      var pos = this.state.objDict[item].position;
      let xpos = parseInt(pos.split(",")[0].substring(1));
      let ypos = parseInt(pos.split(",")[1]);
      let z = pos.split(",")[2];
      let zpos = parseInt(z.substring(0,z.length-1));

      if ("WebSocket" in window) {
        var ws = new WebSocket("ws://localhost:8088/Virtech/F2h6JyzlEH/local,message");    
        ws.onopen = () => {
        if (dir == "x+") {xpos += 1;}
        if (dir == "x-") {xpos -= 1;}
        if (dir == "y+") {ypos += 1;}
        if (dir == "y-") {ypos -= 1;}
        if (dir == "z+") {zpos += 1;}
        if (dir == "z-") {zpos -= 1;}
        if (dir == "") {
          xpos = this.state.xpos;
          ypos = this.state.ypos;
          zpos = this.state.zpos;
        }
      
        pos = "<"+xpos+","+ypos+","+zpos+">";
        ws.send("command=setobjectposition&group=Virtech&password=F2h6JyzlEH&item="+item+"&position="+pos+"&range=10");
        }
        ws.onmessage = (evt) => { 
          var objDictlol = this.state.objDict;
          objDictlol[item].position = pos;
          this.setState({objDict: objDictlol});
          
       };
       ws.onclose = function() { 
          alert("Connection is closed..."); 
       };
    } else {
       alert("WebSocket NOT supported by your Browser!");
        } 
    }

    delete = () => {
      if ("WebSocket" in window) {
      const group = "&group=Virtech&password=F2h6JyzlEH";
      const item = this.state.curr;
      var ws = new WebSocket("ws://localhost:8088/Virtech/F2h6JyzlEH/local,message");    
      ws.onopen = function() {
        ws.send("command=derez"+group+"&item="+item);
      }
      ws.onmessage = (evt) => {
        // var data = evt.data;
        // console.log(data);
        var objDictlol = this.state.objDict;
        delete objDictlol[item];
        this.setState({objDict: objDictlol});
     };
     ws.onclose = function() { 
        alert("Connection is closed..."); 
     };
  } else {
     alert("WebSocket NOT supported by your Browser!");
      } 
    }

    scale = () => {
      if ("WebSocket" in window) {
      var group = "&group=Virtech&password=F2h6JyzlEH";
      var item = this.state.curr;
      var scale = "&scale=%3C0.2%2C+0.2%2C+0.2%3E";
      var ws = new WebSocket("ws://localhost:8088/Virtech/F2h6JyzlEH/local,message");    
      ws.onopen = function() {
        ws.send("command=setobjectscale"+group+"&item="+item+scale);
      }
      ws.onmessage = (evt) => {
        var data = evt.data;
        console.log(data);    
     };
     ws.onclose = function() { 
        alert("Connection is closed..."); 
     };
  } else {
     alert("WebSocket NOT supported by your Browser!");
      } 
    }


  select = (UUID) => {this.setState({curr: UUID});}

  rename = () => {
    var objDictlol = this.state.objDict;
    var item = this.state.curr;
    objDictlol[item]['name'] = this.state.name;
    this.setState({objDict: objDictlol});
  }
  
  findNum = (type) => {
    var num = 1;
    for (let key in this.state.objDict) {
      if (this.state.objDict[key]['type'] == type) {
          num++;
      }
    }
    return num;
  }

  render() {

    return (
      <div className="App">

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center">

          <Grid item xs={4}>
            <Button onClick={() => this.createObj("ball")} variant="contained" color="primary">Ball</Button>
          <br></br>
          <Button onClick={() => this.createObj("plank")} variant="contained" color="primary">Plank</Button>
          <br></br>
          <Button onClick={() => this.createObj("plane")} variant="contained" color="primary">Plane</Button>
          <br></br>
          <Button onClick={() => this.createObj("bucket")} variant="contained" color="primary">Bucket</Button>
          <br></br>
            </Grid>
            <Grid item xs={4}>
            {
        Object.keys(this.state.objDict).map((key, index) => ( 
          <Button onClick={() => this.select(key)} variant="contained" color="primary">{this.state.objDict[key]['name']}</Button>
        ))
        }
            </Grid>
            <Grid item xs={4}>
            <Grid container spacing={2} >

    <form onSubmit={this.handleSubmit}>

          <Grid item >
            <TextField
              autoComplete="0"
              name="xpos"
              variant="outlined"
              fullWidth
              id="xpos"
              label="x position"
              autoFocus
              // type="text"
              value={this.state.xpos}
              onChange={this.handlexChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button 
                    onClick={() => this.move("x-")}
                    variant="contained"
                    color="primary">
                      -</Button>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                      <Button 
                      onClick={() => this.move("x+")}
                      variant="contained"
                      color="primary">
                        +</Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              autoComplete="0"
              name="ypos"
              variant="outlined"
              fullWidth
              id="ypos"
              label="y position"
              autoFocus
              value={this.state.ypos}
              onChange={this.handleyChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button 
                    onClick={() => this.move("y-")}
                    variant="contained"
                    color="primary">
                      -</Button>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                      <Button 
                      onClick={() => this.move("y+")}
                      variant="contained"
                      color="primary">
                        +</Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              autoComplete="0"
              name="zpos"
              variant="outlined"
              fullWidth
              id="zpos"
              label="z position"
              autoFocus
              value={this.state.zpos}
              onChange={this.handlezChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button 
                    onClick={() => this.move("z-")}
                    variant="contained"
                    color="primary">
                      -</Button>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                      <Button 
                      onClick={() => this.move("z+")}
                      variant="contained"
                      color="primary">
                        +</Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Button onClick={this.scale} variant="contained" color="primary">scale</Button>
        <br></br>
        <Button onClick={this.delete} variant="contained" color="primary">delete</Button>
        <br></br>

          <br></br>
          <Grid item xs={12}>
            <TextField
              autoComplete="0"
              name="name"
              variant="outlined"
              fullWidth
              id="name"
              label="Name"
              autoFocus
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </Grid>

          <Button 
          onClick={this.handleSubmit}
          variant="contained"
          color="primary"
          // type="submit"
          value="Submit"
          
          >Submit</Button>
      </form>
        </Grid>
            </Grid>


        </Grid>

        <div>
                <BabylonScene
                width = {400}
                height = {400}
                onSceneMount={this.onSceneMount}
                />
            </div>
        {/* </header> */}
      </div>
    );
  }
}



// class PageWithScene extends React.Component<{}, {}> {
    

//     render() {
//         return (
//             <div>
//                 <BabylonScene
//                 width = {400}
//                 height = {400}
//                 onSceneMount={this.onSceneMount}
//                 />
//             </div>
//         );
//     }
// }




export default App;
