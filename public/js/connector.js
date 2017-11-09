"use strict";
miner.connector = (function () {
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