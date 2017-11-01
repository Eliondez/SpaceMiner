"use strict";

function EGraphicsItem(context) {
  var self = {};
  self.ctx = context;
  self.children = {};
  self.addItem = function(item) {
    self.children[item.id] = item;
    item.parent = this;
  };

  self.removeItem = function(item) {
    delete self.children[item.id];
    item.parent = null;
  };

  self.update = function() {
    for (var i in self.children) {
      self.children[i].update();
    }
  };

  self.render = function() {
    for (var i in self.children) {
      self.children[i].render();
    }
  }
  return self;
}

function Scene(context, size) {
  var self = EGraphicsItem(context);
  var parentRender = self.render;
  var parentUpdate = self.update;
  self.size = size;
  
  self.update = function() {
    // self update part
    parentUpdate();
  }

  self.render = function() {
    // self render part
    self.ctx.beginPath();
    self.ctx.strokeStyle = "white";
    self.ctx.strokeRect(10.5, 10.5, self.size.width, self.size.height)
    parentRender();
  }

  return self;
}

var Entity = function(parent, x, y) {
  var self = EGraphicsItem(parent.ctx);
  self.id = "" + Math.floor(10000000 * Math.random());
  self.x = x;
  self.y = y;
  var parentRender = self.render;
  var parentUpdate = self.update;

  self.getDistance = function(target) {
    return Math.hypot(self.x - target.x, self.y - target.y)
  }

  self.angleTo = function(target) {
    return Math.atan2(target.x - self.x, self.y - target.y)
  }

  self.update = function() {
    // self update part
    parentUpdate();
  }

  self.render = function() {
    // self render part
    parentRender();
  }
  self.parent = parent;
  parent.addItem(self);
  return self;
}
