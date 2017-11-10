"use strict";
// var _ = require('lodash');

miner.input = (function () {
  var x, y, init, canvas, mousePressed;
  x = 0,
  y = 0;

  var throttle = function(func, ms) {
    var isThrottled = false,
    savedArgs,
    savedThis;

    function wrapper() {
      if(isThrottled){
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments);
      isThrottled = true;

      setTimeout( function() {
        isThrottled = false;
        if (savedArgs) {
          console.log(savedThis);
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  var sayXY = throttle(function(a, b) {
    console.log(a, b);
  }, 100);
  var throttledMouseMove = throttle(miner.scene.mouseEvent, 150);
  // var throttledMouseMove2 = _.throttle(miner.scene.mouseEvent, 150);

  init = function(canvas_id) {
    canvas = document.getElementById(canvas_id);
    console.log("Mouse module inited!");
    canvas.addEventListener('mousemove', function(e) {
      x = e.offsetX;
      y = e.offsetY;
      // miner.scene.mouseEvent('mm', { x: x, y: y});
      // sayXY(e.offsetX, e.offsetY);
      throttledMouseMove('mm', {x: e.offsetX, y: e.offsetY});
      // console.log(1, x, y);
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