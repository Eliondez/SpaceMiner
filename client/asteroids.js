var Asteroid = function(context) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        resLeft: 0,
        x: Math.random() * 400,
        y: Math.random() * 200,
        radius: 0,
        hovered: false,
        init: function() {
            var resLeft = 80 + Math.floor(Math.random() * 100);
            self.resLeft = resLeft;
            self.radius = 5 + this.resLeft / 10;
        },
        update: function() {
            self.x += 0.1;
            self.y += 0.1;
        },
        render: function() {
            var ctx = context;
            ctx.beginPath();
            if (self.hovered)
                ctx.fillStyle = '#292';
            else
                ctx.fillStyle = '#ccc';
            ctx.arc(self.x, self.y, self.radius, 0, Math.PI * 2);
            ctx.fill();
        },
        mineOut: function(val) {
            var res = Math.max(Math.min(val, self.resLeft), 0);
            self.resLeft -= val;
            if (self.resLeft <= 0) {
                delete Asteroid.list[self.id];
            } else {
                self.radius = 5 + self.resLeft / 10; 
            }
            return res;
        }
    };
    self.init();
    Asteroid.list[self.id] = self;
    return self;
}

Asteroid.list = {};
