var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game_server = require('./server/game_server.js');

game_server.init(io);

app.use('/static', express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
