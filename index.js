var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game_server = require('./server/game_server.js');
var $ = require('jquery');

game_server.init(io);

app.use('/static', express.static('dist'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
