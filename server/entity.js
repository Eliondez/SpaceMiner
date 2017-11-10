"use strict";

var create_entity = function() {
  var self = {
    position: {
      x: 0,
      y: 0
    },
    targetPos: {
      x: 0,
      y: 0
    },
    maxVelocity: 1,
    canMove: false
  }
  return self;
}

var random_location = function(obj, rect) {
  var x = Math.floor(Math.random() * rect.w) + rect.x;
  var y = Math.floor(Math.random() * rect.h) + rect.y;
  obj.position.x = x;
  obj.position.y = y;
}

module.exports.create_entity = create_entity;
module.exports.random_location = random_location;


