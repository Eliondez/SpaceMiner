"use strict";

var miner = (function () {

  var init = function() {
    console.log("Main module inited!");
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
    
    function preload() {
        game.time.advancedTiming = true;
        game.load.image('arrow', 'static/img/2.png');
    }
    var sprites = [];
    
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        game.stage.backgroundColor = '#343a40';
    
        for (var i = 0; i < 5; i++) {
          var sprite = game.add.sprite(100 + i * 100, 300, 'arrow');
          sprite.anchor.setTo(0.5, 0.5);
      
          //  Enable Arcade Physics for the sprite
          game.physics.enable(sprite, Phaser.Physics.ARCADE);
      
          //  Tell it we don't want physics to manage the rotation
          sprite.body.allowRotation = false;
          sprites.push(sprite);
        }

    
    }
    
    function update() {
        for (var sp in sprites) {
          var sprite = sprites[sp];
          sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 1000) + Math.PI / 2;
        }
    
    }
    
    function render() {
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");   
        // game.debug.spriteInfo(sprite, 32, 32);
    
    }
    

  }

  return { init: init };
})();