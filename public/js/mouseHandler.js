"use strict";
miner.mouseHandler = (function () {
  var x, y, init;
  x = 0,
  y = 0;

  init = function(canvas_element) {
    console.log("Mouse module inited!");
    canvas_element.addEventListener('mousemove', function(e) {
      x = (e.offsetX - 364) / 364;
      y = (250 - e.offsetY) / 250;
      // console.log(x, y);
    })
  }
  return { 
    init: init,
    getCoords: function() {
      return { x: x, y: y };
    }
  };
})();