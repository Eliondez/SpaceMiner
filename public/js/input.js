"use strict";
miner.input = (function () {
  var x, y, init, canvas, mousePressed;
  x = 0,
  y = 0;

  init = function(canvas_id) {
    canvas = document.getElementById(canvas_id);
    console.log("Mouse module inited!");
    canvas.addEventListener('mousemove', function(e) {
      x = e.offsetX;
      y = e.offsetY;
      miner.scene.mouseEvent('mm', { x: x, y: y});
    })
    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    })

    canvas.addEventListener('mousedown', function(e) {
      miner.scene.mouseEvent('m' + e.button + 'd', { x: x, y: y});
    });
    canvas.addEventListener('mouseup', function(e) {
      miner.scene.mouseEvent('m' + e.button + 'u', { x: x, y: y});
    });
    document.addEventListener('keydown', function(e){
      if (e.type == 'keydown') {
        if (e.code == "KeyW") {
        } else if (e.code == "KeyS") {
        } else if (e.code == "KeyA") {
        } else if (e.code == "KeyD") {
        } else if (e.code == "KeyE") {
        } else if (e.code == "KeyQ") {
        }
      }

    });
    document.addEventListener('keyup', function(e){
      // console.log(e.type, e.code);
    });
    
  }

  return { 
    init: init,
    getCoords: function() {
      return { x: x, y: y };
    }
  };
})();