var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [
  {
    id: 1,
    name: "Elion",
    email: "dz_elf@mail.ru",
    password: "123"
  }
]

var currentUsers = {};

var login = function(socket, username, password) {
  console.log(username, password);
  for (var i in users) {
    if (users[i].name == username && users[i].password == password) {
      socket.playerId = users[i].id;
      socket.emit('login_accepted', {});
      return;
    }
  }
  socket.emit('login_failed', {});
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

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('login', function(msg){
    login(socket, msg.login, msg.password);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});