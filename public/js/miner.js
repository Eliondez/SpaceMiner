"use strict";

var miner = (function () {

  var init = function() {
    console.log("Main module inited!");
    miner.connector.init();
    miner.interface.init();
    miner.scene.init("ctx");  
    miner.account.init();  

  }

  return { init: init };
})();