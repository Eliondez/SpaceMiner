"use strict";

var miner = (function () {

  var resizeCanvas = function() {
    miner.canvas.width = $('#game_col').width();
  }

  var init = function() {
    miner.canvas = document.getElementById("ctx");
    window.addEventListener('resize', function(e) {
      resizeCanvas();
    })
    console.log("Main module inited!");
    miner.account.init();
    miner.mouseHandler.init();
    resizeCanvas();
  }

  return { init: init };
})();