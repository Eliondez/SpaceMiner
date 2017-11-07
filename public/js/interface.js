"use strict";

miner.interface = (function() {
  self = {



  }

  var game_state = {
    views: [
      {
        verbose_name: "База",
        name: 'base',
        id: 0
      },
      {
        verbose_name: "Ресурсы",
        name: 'resource',
        id: 1
      },
      {
        verbose_name: "Флот",
        name: 'fleet',
        id: 2
      },
      {
        verbose_name: "Верфь",
        name: 'shipyard',
        id: 3
      },
      {
        verbose_name: "Бой",
        name: 'fight',
        id: 4
      }
    ],
    current_view: null,
    message: 'Hello Vue!'
  }

  self.init = function() {
    console.log("Interface module loaded");
    miner.interface.app = new Vue({
      el: '#app',
      data: game_state
    })

    miner.interface.app.current_view = miner.interface.app.views[0];

  }

  return self;
})()