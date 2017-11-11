/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var connector = __webpack_require__(1)

var miner = (function () {

  var init = function() {
    console.log("Main module inited!");
    miner.connector.init();
    miner.interface.init();
    miner.scene.init("ctx");  
    miner.input.init("ctx");
    miner.account.init();  
  }

  return { init: init };
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var connector = (function () {
  var socket, init, login_try, sendCommand;

  init = function() {
    socket = io();
    socket.on('login_accepted', function(msg){
      console.log("Yay logged in");
    });
    socket.on('login_failed', function(msg){
      console.log("Cant login");
    });
    socket.on('game_data', function(msg){
      for (var i in msg) {
        console.log(i, msg[i]);
      }
    });
  }

  login_try = function(username) {
    socket.on('login_accepted', function(msg) {
      console.log("Logged as " + msg.username);
      socket.on('update_positions', function(msg) {
        miner.scene.updatePosition(msg);
      });
      miner.account.exec_login(msg.username);
    });
    socket.on('add_object', function(msg) {
      miner.scene.addObject(msg);
    });
    socket.on('login_failed', function(msg) {
      console.log("Login failed. Reason: " + msg.message);
    })
    socket.emit('login_attempt', { login: username });
  }

  sendCommand = function(packet) {
    socket.emit('command', packet);
  }

  return { 
    init: init,
    login_try: login_try,
    sendCommand: sendCommand
  };
})();

module.exports = connector;

/***/ })
/******/ ]);