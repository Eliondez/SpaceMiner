"use strict";
miner.connector = (function () {
  var socket, init, login;

  init = function() {
    socket = io();
    socket.on('login_accepted', function(msg){
      console.log("Yay logged in");
    });
    socket.on('login_failed', function(msg){
      console.log("Cant login");
    });
  }

  login = function(username, password) {
    socket.emit('login', { login: username, password: password });
  }

  return { 
    init: init,
    login: login
  };
})();