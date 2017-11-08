var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {
  1: {
    id: 1,
    name: "elion",
    gameInfoId: 5
  }
}


var scenes = [
  {
    id: 4,
    objects: [
      {
        id: 2,
        name: "aazaa",
        owner: {
          name: 'borg',
          id: 1
        },
        x: 200,
        y: 300,
        vX: 0.7,
        vY: 0.6
      },
      {
        id: 3,
        name: "aazaa",
        owner: {
          name: 'borg',
          id: 1
        },
        x: 250,
        y: 150,
        vX: 0.8,
        vY: 0.4
      },
      {
        id: 4,
        name: "aazaa",
        owner: {
          name: 'elion',
          id: 2
        },
        x: 600,
        y: 400,
        vX: 0.2,
        vY: 0.9
      }
    ]
  }
]

var gameInfo = {
  5: {
    base: {
      level: 3,
      status: 'enabled'
    },
    resource: {
      first: 134,
      second: 321
    }
  }
}
var SOCKET_LIST = {};
var currentUsers = {};

var login = function(socket, username) {
  console.log(username);
  if (username == "") {
    socket.emit('login_failed', { 'message': "Надо ввести ник." });
    return;
  }
  for (var i in users) {
    if (users[i].name == username) {
      socket.playerId = users[i].id;
      socket.emit('login_accepted', { 'username': username });
      socket.emit('game_data', gameInfo[users[i].gameInfoId]);
      return;
    }
  }
  socket.emit('login_failed', {});
}

var sendGameInfo = function(id_player) {
  
}

app.use('/static', express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  console.log(socket.game_id);
  socket.game_id = Math.floor(Math.random() * 1000000) + 1000000;
  console.log(socket.game_id);
  SOCKET_LIST[socket.game_id] = socket;
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('login_attempt', function(msg){
    login(socket, msg.login);
  });
});


var updateScenes = function() {
  var packet = [];

  for (var i = 0; i < scenes.length; i++) {
    var scene = scenes[i];
    for (var j = 0; j < scene.objects.length; j++) {
      var obj = scene.objects[j];
      if (obj.x > 700 || obj.x < 100) {
        obj.vX = -obj.vX
      }
      if (obj.y > 700 || obj.y < 100) {
        obj.vY = -obj.vY
      }
      obj.x += obj.vX;
      obj.y += obj.vY;
      var packet_obj = {
        sceneId: scene.id,
        objId: obj.id,
        x: obj.x,
        y: obj.y
      }
      packet.push(packet_obj);
    }
  }

  for (var i in SOCKET_LIST) {
    SOCKET_LIST[i].emit('update_positions', packet);
  }
}

var gameLoop = function() {
  updateScenes();
}

setInterval(function() {
  gameLoop();
}, 1000/60);

http.listen(3000, function(){
  console.log('listening on *:3000');
});