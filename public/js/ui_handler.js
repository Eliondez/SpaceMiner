"use strict";
import Vue from 'vue'

export default function() {
  self = {};

  var ships = {
    1: {
      id: 1,
      name: "Miner1",
      pic: '/static/img/orangeship3.png',
      num: 3
    },
    2: {
      id: 2,
      name: "Miner2",
      pic: '/static/img/orangeship.png',
      num: 5
    }
  }

  var ship_blueprints = {
    1: {
      id: 1,
      ship_id: 1,
      name: "Miner1",
      pic: '/static/img/orangeship3.png',
      price: {
        1: 5,
        2: 10,
        3: 0
      }
    },
    2: {
      id: 2,
      ship_id: 2,
      name: "Miner2",
      pic: '/static/img/orangeship.png',
      price: {
        1: 10,
        2: 20,
        3: 0
      }
    }
  }

  var game_state = {
    ships: ships,
    ship_blueprints: ship_blueprints,
    resources: {
      1: {
        id: 1,
        curVal: 10,
        maxVal: 100,
      },
      2: {
        id: 2,
        curVal: 20,
        maxVal: 200,
      },
      3: {
        id: 3,
        curVal: 30,
        maxVal: 300,
      }
    },
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
        verbose_name: "Экспедиции",
        name: 'fight',
        id: 4
      }
    ],
    current_view: null,
    message: 'Hello Vue!'
  }

  self.init = function() {
    console.log("Ui-handler module loaded");
    var app = new Vue({
      el: '#app',
      data: game_state,
      created: function() {
        this.current_view = this.views[4];
      },
      methods: {
        build_ship: function(bp) {
          console.log(bp);
          for (var i in bp.price) {
            if (bp.price[i] > this.resources[i].curVal) {
              return;
            }
          }
          for (var i in bp.price) {
            this.resources[i].curVal -= bp.price[i];
          }
          this.ships[bp.ship_id].num += 1;
        },
        sell_ship: function(ship) {
          console.log(ship);
        },
        // set_current_scene(num) {
        //   miner.scene.setCurrentScene(num);
        // }
      }
    })
  }

  return self;
}
