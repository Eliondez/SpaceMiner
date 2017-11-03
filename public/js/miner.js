"use strict";

var miner = (function () {

  // var resizeCanvas = function() {
  //   miner.canvas.width = $('#game_col').width() - 2;
  // }

  var init = function() {
    // miner.canvas = document.getElementById("ctx");
    // window.addEventListener('resize', function(e) {
      // resizeCanvas();
    // })
    console.log("Main module inited!");
    
    // resizeCanvas();
    var game_width = $('#game_col').width() - 2;
    var game_height = 800;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45 
      , game_width / game_height , 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    // renderer.setClearColorHex(0xEEEEEE);
    renderer.setSize(game_width, game_height);
    // renderer.shadowMapEnabled = true;
    renderer.setClearColor(0xFFFFFF, 1);
    // var axes = new THREE.AxisHelper( 20 );
    // scene.add(axes);
    var planeGeometry = new THREE.PlaneGeometry(60,60,1,1);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    // plane.receiveShadow = true;
    scene.add(plane);
    var cubeGeometry = new THREE.CubeGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshStandardMaterial(
      {color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    // cube.castShadow = true;
    scene.add(cube);
    var sphereGeometry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial(
      {color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    // sphere.castShadow = true;
    scene.add(sphere);
    camera.position.x = 45;
    camera.position.y = 999;
    camera.position.z = 45;
    camera.lookAt(plane.position);
    $("#game_col").append(renderer.domElement);


    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add(spotLight);
    // renderer.render(scene, camera);
  
    miner.account.init();
    miner.mouseHandler.init(renderer.domElement);
    miner.connector.init();
    
    var sphere_vel_x = Math.random();
    var sphere_vel_z = Math.random();

    var step=0;
    function renderScene() {
      requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
      
      if (sphere.position.z < -20 || sphere.position.z > 20) {
        sphere_vel_z = -sphere_vel_z;
      }
      if (sphere.position.x < -10 || sphere.position.x > 40) {
        sphere_vel_x = -sphere_vel_x;
      }

      step+=0.04;
      sphere.position.x = 20+( 10*(Math.cos(step)));
      sphere.position.y = 2 +( 10*Math.abs(Math.sin(step))); 
      if (camera.position.y > 50) {
        camera.position.y -= 8;
        camera.lookAt(plane.position);
      }
      
    }

    renderScene();
  }

  return { init: init };
})();