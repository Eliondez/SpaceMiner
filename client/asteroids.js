var Asteroid = function(context) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        resLeft: 0,
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 200,
        radius: 0,
        hovered: false,
        init: function() {
            var resLeft = 80 + Math.floor(Math.random() * 100);
            self.resLeft = resLeft;
            self.radius = 5 + this.resLeft / 10;
            self.image = new Image(360, 288);   // using optional size for image
            self.image.src = 'asteroid1.png';

        },
        update: function() {
            self.x += 0.1;
            self.y += 0.1;
        },
        render: function() {
            var ctx = context;
            ctx.beginPath();
            var size = self.radius * 2;
            ctx.drawImage(self.image, 0,0, 70, 70, self.x-size/2, self.y-size/2, size, size);
            if (self.hovered)
                // ctx.fillStyle = 'rgba(100,100,100,0.4)';
                ctx.arc(self.x, self.y, self.radius, 0, Math.PI * 2);
                ctx.stroke();
            // else
                // ctx.fillStyle = 'rgba(100,100,100,0.2)';
            // ctx.arc(self.x, self.y, self.radius, 0, Math.PI * 2);
            // ctx.fill();

            
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
