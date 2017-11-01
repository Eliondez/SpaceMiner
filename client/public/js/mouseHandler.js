"use strict";
miner.mouseHandler = (function () {
  var x, y, init;
  x = 0,
  y = 0;

  init = function() {
    console.log("Mouse module inited!");

    // canvas.addEventListener('contextmenu', function(e) {
    //   e.preventDefault();
    //   handleClick(e);
    // })

    // document.addEventListener('keydown', function(e) {
    //     keysHandle(e);
    // })
    // document.addEventListener('keyup', function(e) {
    //     keysHandle(e);
    // })

    miner.canvas.addEventListener('mousemove', function(e) {
      x = e.offsetX;
      y = e.offsetY;
    })

  }

  return { 
    init: init,
    x: x,
    y: y
  };
})();