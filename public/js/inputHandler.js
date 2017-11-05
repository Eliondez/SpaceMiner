"use strict";
miner.mouseHandler = (function () {
  var x, y, init;
  x = 0,
  y = 0;

  init = function() {
    // console.log("Mouse module inited!");
    // miner.canvas.addEventListener('mousemove', function(e) {
    //   miner.mouseHandler.x = e.offsetX;
    //   miner.mouseHandler.y = e.offsetY;
    // })
    // miner.canvas.addEventListener('contextmenu', function(e) {
    //   e.preventDefault();
    // })

    // miner.canvas.addEventListener('mousedown', function(e) {
    //   var x = e.offsetX;
    //   var y = e.offsetY;
    //   var res = miner.renderer.camToScene({ x: x, y: y});
    // });
    // miner.canvas.addEventListener('mouseup', function(e) {
    // });
    // document.addEventListener('keydown', function(e){
    //   if (e.type == 'keydown') {
    //     if (e.code == "KeyW") {
    //       miner.cam.y -= 5;
    //     } else if (e.code == "KeyS") {
    //       miner.cam.y += 5;
    //     } else if (e.code == "KeyA") {
    //       miner.cam.x -= 5;
    //     } else if (e.code == "KeyD") {
    //       miner.cam.x += 5;
    //     } else if (e.code == "KeyE") {
    //       miner.cam.setScale(miner.cam.scale + 0.1);
    //     } else if (e.code == "KeyQ") {
    //       miner.cam.setScale(miner.cam.scale - 0.1);
    //     }
    //   }

    // });
    // document.addEventListener('keyup', function(e){
    //   // console.log(e.type, e.code);
    // });
    
  }

  return { 
    init: init,
    // getCoords: function() {
    //   return { x: x, y: y };
    // }
  };
})();