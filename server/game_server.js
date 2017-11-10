"use strict";


var GameServer = (function() {
  var gl_users = require('./users.js');
  var gl_scenes = require('./battle_scenes.js');
  var ent = require("./entity.js");
  // var ob = ent.create_entity();


  var init = function (ws) {
    var SOCKET_LIST = {};
    var login = function(socket, username) {
      if (username == "") {
        socket.emit('login_failed', { 'message': "Надо ввести ник." });
        return;
      }
      var user = gl_users.loginUser(username, socket);
      if (user) {
        addAllObjectsToPlayer(user.id, 4);
        addAllObjectsToPlayer(user.id, 3);
        addAllObjectsToPlayer(user.id, 2);
        socket.on('command', function(msg) {
          var scenes = gl_scenes.getScenes();
          for (var i in msg.objects) {
            scenes[msg.sceneId].objects[msg.objects[i]].targetPos.x = msg.target.x;
            scenes[msg.sceneId].objects[msg.objects[i]].targetPos.y = msg.target.y;
          }
        });
        socket.emit('login_accepted', { 'username': username });
        return;
      }
      socket.emit('login_failed', {});
    }
    
    var sendGameInfo = function(id_player) {
      
    }
    
    ws.on('connection', function(socket){
      console.log('a user connected');
      socket.game_id = Math.floor(Math.random() * 1000000) + 1000000;
      SOCKET_LIST[socket.game_id] = socket;
      socket.on('disconnect', function(){
        var usrs = gl_users.getUsers();
        if (socket.userId) 
          gl_users.disconnectUser(socket.userId);
        delete SOCKET_LIST[socket.game_id]
        console.log('user disconnected');
      });
      socket.on('login_attempt', function(msg){
        login(socket, msg.login);
      });
    });

    var createObject = function(id) {
      var obj = {
        id: id,
        name: "aazaa",
        owner: {
          name: 'borg',
          id: 1
        },
        x: Math.floor(Math.random() * 500 + 150),
        y: Math.floor(Math.random() * 500 + 150),
        targetPos: {
          x: Math.floor(Math.random() * 500 + 150),
          x: Math.floor(Math.random() * 500 + 150)
        },
        vel: 1.1
      }
      return obj
    }
    
    var addObjectToScene = function(sceneId, objId) {
      var obj = createObject(objId);
      gl_scenes.addObjectToScene(obj, sceneId);
    }
    
    var addAllObjectsToPlayer = function(playerId, sceneId) {
      var scenes = gl_scenes.getScenes();
      var scene = scenes[sceneId];
      for (var objId in scene.objects) {
        addObjectToPlayer(playerId, sceneId, objId);
      }
    }
    
    
    var addObjectToPlayer = function(playerId, sceneId, objId) {
      var scenes = gl_scenes.getScenes();
      var obj = scenes[sceneId].objects[objId];
      var packet = {
        sceneId: sceneId,
        obj: {
          id: objId,
          name: obj.name,
          owner: obj.owner,
          x: obj.x,
          y: obj.y,
          targetPos: obj.targetPos
        }
      }
      gl_users.sendObjectToUser(playerId, packet);
    }
    
    var updateScenes = function() {
      var packet = gl_scenes.updateScenes();
      var usrs = gl_users.getUsers();
      for (var i in usrs) {
        var user = usrs[i];
        if (user.isOnline)
          user.socket.emit('update_positions', packet);
      }
    }
    
    var gameLoop = function() {
      updateScenes();
    }
    
    setInterval(function() {
      gameLoop();
    }, 1000/60);
    
    
    var i = 6;

    setInterval(function(){
      if (i > 15) {
        return;
      }
      addObjectToScene(4, i);
      // addObjectToScene(3, i);
      // addObjectToScene(2, i);
      var usrs = gl_users.getUsers();
      for (var userId in usrs) {
        if (usrs[userId].isOnline) {
          addObjectToPlayer(userId, 4, i);
          // addObjectToPlayer(userId, 3, i);
          // addObjectToPlayer(userId, 2, i);
        }
      }
      i += 1;
    }, 3000);
  }

  return {
    init: init
  }
})();

module.exports = GameServer;

