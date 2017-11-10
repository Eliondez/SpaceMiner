"use strict";

var Users = (function() {
  var users = {
    1: {
      id: 1,
      name: "t1",
      gameInfoId: 5,
      isOnline: false
    },
    2: {
      id: 2,
      name: "t2",
      gameInfoId: 6,
      isOnline: false
    }
  }

  var getUsers = function () {
    return users;
  }

  var addUser = function(user) {

  }

  var removeUser = function(user) {

  }

  var loginUser = function(username, socket) {
    for (var i in users) {
      if (users[i].name === username && users[i].isOnline === false) {
        users[i].socket = socket;
        socket.playerId = users[i].id;
        users[i].isOnline = true;
        return users[i];
      }
    }
    return false;
  }

  var disconnectUser = function(user) {
    if (users[user.id].isOnline) {
      users[user.id].isOnline = false;
      users[user.id].socket = null;
    }
  }

  var sendObjectToUser = function(user_id, packet) {
    if (users[user_id].isOnline) {
      users[user_id].socket.emit('add_object', packet);
    }
  }


  return {
    getUsers: getUsers,
    addUser: addUser,
    removeUser: removeUser,
    loginUser: loginUser,
    disconnectUser: disconnectUser,
    sendObjectToUser: sendObjectToUser
  }

})();

module.exports = Users;