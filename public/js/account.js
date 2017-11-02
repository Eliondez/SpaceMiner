"use strict";
miner.account = (function () {
  var loggedIn, name, login, logout, init;
  name = "";
  loggedIn = false;

  init = function() {
    $('#login_btn').on('click', function() {
      login();
      // $('#login_modal').modal('hide');
      // $('#login_modal_btn').html('Logout (' + name + ')');
    })
    console.log("Account module inited!");
  }

  login = function() {
    var email = $("#login_modal #email_input").val();
    var pass = $("#login_modal #password_input").val();
    miner.connector.login(email, pass);
    name = "Elion";
    loggedIn = true;
  }

  logout = function() {
    console.log("Logged out");
  }

  return { 
    init: init,
    loggedIn: loggedIn,
    name: name
  };
})();