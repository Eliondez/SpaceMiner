"use strict";


var GameServer = (function() {
  var gl_users = require('./users.js');


  var init = function (ws) {
    var users = {
      1: {
        id: 1,
        name: "t1",
        gameInfoId: 5
      },
      2: {
        id: 2,
        name: "t2",
        gameInfoId: 6
      }
    }
    var scenes = {
      4: {
        id: 4,
        objects: {
          4: {
            id: 4,
            name: "aazaa",
            owner: {
              name: 'elion',
              id: 2
            },
            x: 600,
            y: 400,
            targetPos: {
              x: Math.floor(Math.random() * 500 + 150),
              x: Math.floor(Math.random() * 500 + 150)
            },
            vel: 1.1
          }
        }
      },
      3: {
        id: 3,
        objects: {
          4: {
            id: 4,
            name: "aazaa",
            owner: {
              name: 'elion',
              id: 2
            },
            x: 600,
            y: 400,
            targetPos: {
              x: Math.floor(Math.random() * 500 + 150),
              x: Math.floor(Math.random() * 500 + 150)
            },
            vel: 1.1
          }
        }
      },
      2: {
        id: 2,
        objects: {
          4: {
            id: 4,
            name: "aazaa",
            owner: {
              name: 'elion',
              id: 2
            },
            x: 600,
            y: 400,
            targetPos: {
              x: Math.floor(Math.random() * 500 + 150),
              x: Math.floor(Math.random() * 500 + 150)
            },
            vel: 1.1
          }
        }
      }
    }
    
    var SOCKET_LIST = {};
    var CURRENT_USERS = {};
    
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
        for (var i in usrs) {
          if (usrs[i].socket == socket) {
            gl_users.disconnectUser(usrs[i].id)
          }
        }
        console.log('user disconnected');
      });
      socket.on('login_attempt', function(msg){
        login(socket, msg.login);
      });
    });
    
    var addObjectToScene = function(sceneId, objId) {
      var obj = {
        id: objId,
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
      scenes[sceneId].objects[objId] = obj;
    }
    
    var addAllObjectsToPlayer = function(playerId, sceneId) {
      var scene = scenes[sceneId];
      for (var objId in scene.objects) {
        addObjectToPlayer(playerId, sceneId, objId);
      }
    }
    
    
    var addObjectToPlayer = function(playerId, sceneId, objId) {
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
      var packet = [];
    
      for (var i in scenes) {
        var scene = scenes[i];
        for (var j in scene.objects) {
          var obj = scene.objects[j];
          var dist = Math.hypot(obj.targetPos.y - obj.y, obj.targetPos.x - obj.x);
          if (dist > 5) {
    
            var angle = Math.atan2(obj.targetPos.y - obj.y, obj.targetPos.x - obj.x);
            obj.x += obj.vel * Math.cos(angle);
            obj.y += obj.vel * Math.sin(angle);
          } else {
            obj.vel = Math.ceil(Math.random() * 3);
            obj.targetPos.x = Math.floor(Math.random() * 500 + 150);
            obj.targetPos.y = Math.floor(Math.random() * 500 + 150);
          }
          
          var packet_obj = {
            sceneId: scene.id,
            objId: obj.id,
            x: obj.x,
            y: obj.y,
            targetPos: obj.targetPos
          }
          packet.push(packet_obj);
        }
      }
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
      addObjectToScene(3, i);
      addObjectToScene(2, i);
      var usrs = gl_users.getUsers();
      for (var userId in usrs) {
        if (usrs[userId].isOnline) {
          addObjectToPlayer(userId, 4, i);
          addObjectToPlayer(userId, 3, i);
          addObjectToPlayer(userId, 2, i);
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

