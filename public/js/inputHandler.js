"use strict";
miner.mouseHandler = (function () {
  var x, y, init;
  x = 0,
  y = 0;

  init = function() {
    console.log("Mouse module inited!");
    miner.canvas.addEventListener('mousemove', function(e) {
      x = e.offsetX;
      y = e.offsetY;
      // console.log(x, y);
    })
    miner.canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    })

    miner.canvas.addEventListener('mousedown', function(e) {
      console.log(e.type, e.button);
    });
    miner.canvas.addEventListener('mouseup', function(e) {
      console.log(e.type, e.button);
    });
    document.addEventListener('keydown', function(e){
      console.log(e.type, e.code);
    });
    document.addEventListener('keyup', function(e){
      console.log(e.type, e.code);
    });
    
  }
  return { 
    init: init,
    getCoords: function() {
      return { x: x, y: y };
    }
  };
})();