var Bullet = function(context, parent, angle) {
  var self = {
      id: "" + Math.floor(10000000 * Math.random()),
      x: parent.x,
      y: parent.y,
      timeLeft: 100,
      xVel: Math.sin(angle) * 15,
      yVel: -Math.cos(angle) * 15,
      parent: parent,
      update: function() {
        self.timeLeft -= 1;
        
        self.x += self.xVel;
        self.y += self.yVel;

      },
      render: function() {
          if (self.timeLeft <= 0)
            delete Bullet.list[self.id];
          var ctx = context;
          ctx.beginPath();
          ctx.arc(self.x, self.y, 2, 0, Math.PI * 2);
          ctx.fill();
      },
      checkCollisions: function() {

      },
  };
  Bullet.list[self.id] = self;
  return self;
};

Bullet.list = {};