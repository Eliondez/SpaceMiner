"use strict";

var Users = (function() {
  var users = {
    1: {
      id: 1,
      name: "t1",
      gameInfoId: 5,
      isOnline: false,
      scene_ids: [2, 3, 4]
    },
    2: {
      id: 2,
      name: "t2",
      gameInfoId: 6,
      isOnline: false,
      scene_ids: [2, 3, 4]
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
        socket.userId = users[i].id;
        users[i].isOnline = true;
        return users[i];
      }
    }
    return false;
  }

  var disconnectUser = function(userId) {
    if (users[userId].isOnline) {
      users[userId].isOnline = false;
      users[userId].socket = null;
    }
  }

  var sendObjectToUser = function(userId, packet) {
    if (users[userId].isOnline) {
      users[userId].socket.emit('add_object', packet);
    }
  }

  // var sendAllObjectsToUser = function(userId) {
  //   var scene_ids = users[userId].scene_ids;
  //   var packet = [];
  // }


  return {
    getUsers: getUsers,
    addUser: addUser,
    removeUser: removeUser,
    loginUser: loginUser,
    disconnectUser: disconnectUser,
    sendObjectToUser: sendObjectToUser
    // sendAllObjectsToUser: sendAllObjectsToUser
  }

})();

module.exports = Users;