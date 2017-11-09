"use strict";
miner.account = (function () {
  var 
  on_login_click,
  on_login_modal_click,
  loggedIn, 
  name, 
  exec_login, 
  exec_logout, 
  init;
  name = "";
  loggedIn = false;

  init = function() {
    // $('#login_modal').modal('show');
    $('#login_modal_btn').on('click', on_login_modal_click);
    $('#login_btn').on('click', on_login_click);
  }

  on_login_click = function() {
    if (loggedIn) {
      exec_logout();
    } else {
      $('#login_modal').modal('show');
    }
  }

  on_login_modal_click = function() {
    var username = $("#login_modal #login_username_input").val();
    miner.connector.login_try(username);
  }

  exec_login = function(username) {
    name = username;
    loggedIn = true;
    $('#login_modal').modal('hide');
    $('#login_btn').html('Logout (' + username + ')');
  }

  exec_logout = function() {
    name = "";
    loggedIn = false;
    $('#login_btn').html('Login');
  }

  return { 
    init: init,
    loggedIn: loggedIn,
    name: name,
    exec_login: exec_login
  };
})();