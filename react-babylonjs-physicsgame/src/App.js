import logo from './logo.svg';
import './App.css';
// import React from 'react';

import ball from './ball.svg';
import bucket from './bucket.svg';
import plank from './plank.svg';
import ramp from './ramp.svg';

import * as React from "react";
import * as BABYLON from "babylonjs";
import BabylonScene, {SceneEventArgs} from "./SceneComponent";

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'; 
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// import DoneIcon from '@material-ui/icons/Done';

import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {Icon} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class App extends React.Component<{}, {}> {

  

    onSceneMount = (e: SceneEventArgs) => {
        const {canvas, scene, engine} = e;
        const centerPos = (249,136,3);
        
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
        // scene.createDefaultEnvironment();
        // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
        // backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


        // if (this.state.currLevel == 1) {
        //   var sphere1 = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.5, scene);
        //   sphere1.position.y = 0;
        //   var cylinder1 = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 1.5}, scene);
        //   cylinder1.position.y = -3;
        //   cylinder1.position.x = 2;
    
        // }
        
        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }

            if (this.state.currLevel == 1) {
              var sphere1 = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.5, scene);
              sphere1.position.y = 0;
              var cylinder1 = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 1.5}, scene);
              cylinder1.position.y = -3;
              cylinder1.position.x = 2;
        
            }
            
            for (let key in this.state.objDict) {
              // scene.dispose();
              console.log(this.state.objDict);
              var obj = this.state.objDict[key]['type'];
    
              if (obj == "ball") {
                var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.5, scene);
                sphere.position.y = 0;
              }
              if (obj == "plank") {
                // var ramp = BABYLON.MeshBuilder.CreateBox('box', {height: 0.5, width: 20, depth: 10, updatable: true}, scene);
                var ramp = BABYLON.MeshBuilder.CreateBox('box', {height: 1.25, width: 5, depth: 0.25, updatable: true}, scene);
                ramp.position.z = 0;
                ramp.rotate(BABYLON.Axis.Z, -BABYLON.Tools.ToRadians(20), BABYLON.Space.LOCAL);
              }
              if (obj == "plane") {
    
              }
              if (obj == "bucket") {
                var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {subdivisions: 2}, scene);
              }
            }
        });


    };

  constructor(props) {
    super(props);
    this.state = {value: '', objDict: {}, curr: 'none',
                  xpos: '', ypos: '', zpos: '', name: '',
                currLevel: 0, size: 1, xangle: 0,
              yangle: 0, zangle: 0, levelText: 'Click the red button to start!',
            paneText: 'Nothing is selected'};
    this.handlexChange = this.handlexChange.bind(this);
    this.handleyChange = this.handleyChange.bind(this);
    this.handlezChange = this.handlezChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    
    this.handlexAngleChange = this.handlexAngleChange.bind(this);
    this.handlexInputChange = this.handlexInputChange.bind(this);
    this.handlexBlur = this.handlexBlur.bind(this);

    this.handleyAngleChange = this.handleyAngleChange.bind(this);
    this.handleyInputChange = this.handleyInputChange.bind(this);
    this.handleyBlur = this.handleyBlur.bind(this);

    this.handlezAngleChange = this.handlezAngleChange.bind(this);
    this.handlezInputChange = this.handlezInputChange.bind(this);
    this.handlezBlur = this.handlezBlur.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlexChange(event) {    this.setState({xpos: event.target.value});   }
  handleyChange(event) {    this.setState({ypos: event.target.value});   }
  handlezChange(event) {    this.setState({zpos: event.target.value});   }
  handleNameChange(event) {     this.setState({name: event.target.value})    };
  handleSizeChange(event) {     this.setState({size: event.target.value})    };
  
  handlexAngleChange(event, newValue) {     this.setState({xangle: newValue})    };
  handlexInputChange(event) {     this.setState({xangle: event.target.value})    };
  handlexBlur () {
    if (this.state.xangle < 0) {
      this.setState({xangle: 0});
    } else if (this.state.xangle > 360) {
      this.setState({xangle: 360});
    }
  };

  handleyAngleChange(event, newValue) {     this.setState({yangle: newValue})    };
  handleyInputChange(event) {     this.setState({yangle: event.target.value})    };
  handleyBlur () {
    if (this.state.yangle < 0) {
      this.setState({yangle: 0});
    } else if (this.state.yangle > 360) {
      this.setState({yangle: 360});
    }
  };

  handlezAngleChange(event, newValue) {     this.setState({zangle: newValue})    };
  handlezInputChange(event) {     this.setState({zangle: event.target.value})    };
  handlezBlur () {
    if (this.state.zangle < 0) {
      this.setState({zangle: 0});
    } else if (this.state.zangle > 360) {
      this.setState({zangle: 360});
    }
  };
  
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


  select = (UUID) => {
    this.setState({curr: UUID});
    this.setState({paneText: this.state.objDict[UUID].name});
  }

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

  startGame = () => {
    this.state.currLevel = 1;
    console.log("lol");
    this.startLevel();
  }

  startLevel = () => {

    // if (this.state.currLevel == 0) {
    //   console.log("poop0")
    //   return "Click the red button to start!"
    // }

    if (this.state.currLevel == 1) {

      console.log("poop1")
      var group = "&group=Virtech&password=F2h6JyzlEH";
      var ball = "&item=%2FMy+Inventory%2FObjects%2FBall";
      var bucket = "&item=%2FMy+Inventory%2FObjects%2FBucket";
      var ws = new WebSocket("ws://localhost:8088/Virtech/F2h6JyzlEH/local,message");      
      ws.onopen = () => {
      ws.send("command=rez"+group+"&position=<249,130,4>"+ball);
      ws.send("command=rez"+group+"&position=<249,132,2>"+bucket);
      }
      ws.onmessage = (evt) => {

        var data = evt.data;
        var arr = data.split("data=");
        var arr2 = arr[1].split("&success=");
        var UUID = arr2[0];
        this.setPermissions(UUID);
        // this.state.objDict[UUID] = {'type': obj, 'position': defaultpos};
        // ws.send("command=setobjectpermissions"+group+"&item="+UUID+permissions);      
     };

     this.setState({levelText: "Level 1: Get the ball in the bucket!"});

    }
  }

  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  render() {


    return (
      <div className="App">
        {/* <AppBar>
          <Toolbar>

          </Toolbar>
        </AppBar> */}
      
      <div>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          // display={isMobile ? 'block' : 'flex'}
          spacing={0}
          marginTop={0}
          >

          <Grid         
          item xs={1}>

            {/* <IconButton>
              <PlayCircleOutlineIcon style={{color: 'red', width: '60px', height: '60px'}}/>
            </IconButton> */}
            
            <div >
            <List component="nav" aria-label="main mailbox folders" >
              <ListItem innerDivStyle={{paddingLeft: 60}} alignItems="center" button onClick={() => this.createObj("ball")}>
                <ListItemIcon>
                  <Icon>
                    <img src={ball} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary="Ball" />
              </ListItem>
              <ListItem button onClick={() => this.createObj("plank")}>
              <ListItemIcon>
                  <Icon>
                    <img src={plank} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary="Plank" />
              </ListItem>
              <ListItem button onClick={() => this.createObj("plane")}>
              <ListItemIcon>
                  <Icon>
                    <img src={ramp} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary="Plane" />
              </ListItem>
              <ListItem button onClick={() => this.createObj("bucket")}>
              <ListItemIcon>
                  <Icon>
                    <img src={bucket} height={25} width={25} />
                  </Icon>
                </ListItemIcon>
                <ListItemText primary="Bucket" />
              </ListItem>
            </List>
            </div>
          </Grid>

          {/* <Divider orientation="vertical" flexItem /> */}
          <Divider orientation="vertical" flexItem 
          style={{
            // width: '10px',
          // filter: 'blur(7px)',
          boxShadow: '1px 1px 7px grey'
          }}/>

          <Grid item xs={8}>
            <div >
              
            <br /><br /><br />
          <header>
          {this.state.levelText}
        </header>
        <br />

        <Grid container 
        spacing={2}
        justifyContent="center"
        alignItems="center">
          <Grid item>
            <Button 
            onClick={this.startGame}
            variant="contained"
            value="Run"
            style={{backgroundColor: 'red', color: '#FFFFFF', fontSize: '16px',
            maxWidth: '150px', maxHeight: '80px', minWidth: '180px', minHeight: '60px'}}
            endIcon={<PlayCircleOutlineIcon style={{width: '40px', height: '40px'}}/>}
          >
            Start Game</Button>
          </Grid>
          <Grid item>
            <Button 
            variant="contained"
            // color="primary"
            value="Run"
            style={{backgroundColor: '#2196f3', color: '#FFFFFF', fontSize: '16px',
            maxWidth: '150px', maxHeight: '80px', minWidth: '165px', minHeight: '60px'}}
            endIcon={<ArrowForwardIcon />}
          >
            Run Physics</Button>
          </Grid>
        </Grid>
       
        <br /> <br />

        <Grid container
        justifyContent="center"
        alignItems="center">

            <Grid item xs={10}>
            <BabylonScene
                width = {870}
                height = {870}
                onSceneMount={this.onSceneMount}
                />
            </Grid>
            <Grid item xs={2}>
            {
            Object.keys(this.state.objDict).map((key, index) => ( 
              <Button onClick={() => this.select(key)} variant="contained" color="primary">{this.state.objDict[key]['name']}</Button>
            ))
            }
            </Grid>

        </Grid>


          {/* <div style={{alignContent: "center"}}>
                <BabylonScene
                width = {850}
                height = {850}
                onSceneMount={this.onSceneMount}
                />
            </div>
            <br />
            {
            Object.keys(this.state.objDict).map((key, index) => ( 
              <Button onClick={() => this.select(key)} variant="contained" color="primary">{this.state.objDict[key]['name']}</Button>
            ))
            } */}
            </div>
          </Grid>

          <Divider orientation="vertical" flexItem 
          style={{
            // width: '10px',
          // filter: 'blur(7px)',
          boxShadow: '1px 1px 7px grey'
          }}/>

          <Grid
          // component={Paper}
          // elevation={6}        
          item xs>
            <div style={{padding: 40}}>
            <form onSubmit={this.handleSubmit}>
            <Grid
            container
            direction={"column"}
            // justifyContent="center"
            // alignItems="center"
            spacing={2}
            >
            {/* <form onSubmit={this.handleSubmit}> */}
            <header>{this.state.paneText}</header>
            <br />
            <Grid item>
                    <TextField
                      autoComplete="0"
                      name="name"
                      variant="outlined"
                      fullWidth
                      id="name"
                      label="Name of Object"
                      autoFocus
                      value={this.state.name}
                      onChange={this.handleNameChange}
                    />
                  </Grid>

                {/* x controls */}
                <Grid item >
                    <TextField
                      autoComplete="0"
                      name="xpos"
                      variant="outlined"
                      fullWidth
                      id="xpos"
                      label="x position"
                      autoFocus
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

              {/* y controls */}
                <Grid item>
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

              
              {/* z controls */}
                <Grid item>
                    <TextField
                      alignContent = "center"
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

                  {/* <Slider
                    value={typeof value === 'number' ? value : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                  /> */}
                
                <br />

                <Typography id="discrete-slider" align="left">
                  Size
                </Typography>
                <Slider
                onChange={this.handleSizeChange}
                defaultValue={1}
                // getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={5} />

                <br />

            <Typography id="input-slider" align="left">
                  x angle
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                    value={this.state.xangle}
                    onChange={this.handlexAngleChange}
                    aria-labelledby="input-slider"
                    step={1}
                    min={0}
                    max={360}
                    />
                  </Grid>
                  <Grid item>
                      <Input
                      // className={classes.input}
                      value={this.state.xangle}                  margin="dense"
                      onChange={this.handlexInputChange}
                      onBlur={this.handlexBlur}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 360,
                        type: 'number',
                        'aria-labelledby': 'input-slider'
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography id="input-slider" align="left">
                  y angle
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                    value={this.state.yangle}
                    onChange={this.handleyAngleChange}
                    aria-labelledby="input-slider"
                    step={1}
                    min={0}
                    max={360}
                    />
                  </Grid>
                  <Grid item>
                      <Input
                      // className={classes.input}
                      value={this.state.yangle}
                      margin="dense"
                      onChange={this.handleyInputChange}
                      onBlur={this.handleyBlur}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 360,
                        type: 'number',
                        'aria-labelledby': 'input-slider'
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography id="input-slider" align="left">
                  z angle
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                    value={this.state.zangle}
                    onChange={this.handlezAngleChange}
                    aria-labelledby="input-slider"
                    step={1}
                    min={0}
                    max={360}
                    />
                  </Grid>
                  <Grid item>
                      <Input
                      // className={classes.input}
                      value={this.state.zangle}
                      margin="dense"
                      onChange={this.handlezInputChange}
                      onBlur={this.handlezBlur}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 360,
                        type: 'number',
                        'aria-labelledby': 'input-slider'
                      }}
                    />
                  </Grid>
                </Grid>

                <br />
                  <Button onClick={this.delete} variant="contained" color="primary">delete</Button>
                  
                  
                  <br />
                  <Button 
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                  // type="submit"
                  value="Submit"
                  
                  >Submit</Button>

            {/* </form> */}
            </Grid>
            </form>
            </div>
          </Grid>
        </Grid>
      </div>
      </div>
    );
  }
}



export default App;