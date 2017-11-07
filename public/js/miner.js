"use strict";

var miner = (function () {

  var init = function() {
    console.log("Main module inited!");
    miner.interface.init();    

  }

  return { init: init };
})();