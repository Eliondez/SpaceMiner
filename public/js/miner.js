"use strict";
var connector = require('./connector.js')
var ui_handler = require('./ui_handler.js')
var scene = require('./scene.js')
var input = require('./input.js')
var account = require('./account.js')

var miner = (function () {

  var init = function() {
    console.log("Main module inited!");
    connector.init();
    ui_handler.init();
    scene.init("ctx");  
    input.init("ctx");
    account.init();  
  }

  return { init: init };
})();