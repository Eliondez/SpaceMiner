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


    var scene = new THREE.Scene();
    var game_width = $('#game_col').width() - 2;
    var game_height = 800;
    var camera = new THREE.PerspectiveCamera( 75, game_width / game_height, 0.1, 1000 );
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( game_width, game_height );
    var game_cont = document.getElementById('game_col');
    game_cont.appendChild( renderer.domElement );

    var cubes = [];
    for (var i = 0; i < 9; i++) {
      var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.001 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );
      cubes.push(cube);
    }
    
    
    camera.position.z = 5;

    miner.account.init();
    miner.mouseHandler.init(renderer.domElement);
    miner.connector.init();
    
    
    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      var coords = miner.mouseHandler.getCoords();
      for (var i in cubes) {
        var cube = cubes[i];
        cube.position.x = coords.x + (i % 3) * 0.2;
        cube.position.y = coords.y + (Math.floor(i / 3)) * 0.2;
      }
      
    }
    animate();


    
  }

  return { init: init };
})();