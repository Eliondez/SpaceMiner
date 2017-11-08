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


http.listen(3000, function(){
  console.log('listening on *:3000');
});