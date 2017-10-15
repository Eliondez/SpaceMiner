var Asteroid = function(context) {
    self = {
        id: 1,
        resLeft: 80,
        x: Math.random() * 700,
        y: Math.random() * 300,
        radius: 10,
        hovered: false,
        render: function() {
            var ctx = context;
            ctx.beginPath();
            if (self.hovered)
                ctx.fillStyle = '#292';
            else
                ctx.fillStyle = '#ccc';
            ctx.arc(self.x, self.y, 11, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    return self;
}

Asteroid.asteroidList = [];
