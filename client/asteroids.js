var Asteroid = function(context) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        resLeft: 0,
        name: "Veldspar",
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 200,
        radius: 0,
        currentTime: 0,
        currentFrame: 0,
        // rotation: Math.random() * Math.PI,
        hovered: false,
        init: function() {
            var resLeft = 80 + Math.floor(Math.random() * 100);
            self.resLeft = resLeft;
            self.radius = 5 + this.resLeft / 10;
            self.image = new Image(360, 288);   // using optional size for image
            self.image.src = 'asteroid1.png';

        },
        update: function() {
            self.currentTime += 1;
            if (self.currentTime >= 5) {
                self.currentTime = 0;
                self.currentFrame += 1;
            }
            if (self.currentFrame >= 19)
                self.currentFrame = 0;
        },
        render: function() {
            var ctx = context;
            ctx.beginPath();
            var size = self.radius * 2;
            var imageXSlide = Math.floor(self.currentFrame % 5);
            var imageYSlide = Math.floor(self.currentFrame / 5);
            // ctx.save();
            // ctx.translate(self.x-size/2, self.y-size/2);
            // ctx.rotate(self.rotation*Math.PI/180);
            ctx.drawImage(self.image, 3 + imageXSlide * 72 , 3 + imageYSlide * 72, 72, 72, self.x-size/2 + 2, self.y-size/2 + 2, size, size);
            // ctx.restore();
            if (self.hovered) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(100,100,100,0.4)';
                ctx.arc(self.x, self.y, self.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
                // ctx.fillStyle = 'rgba(100,100,100,0.4)';
                
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
        },
        getDistance: function(target) {
            return Math.hypot(self.x - target.x, self.y - target.y);
        }
    };
    self.init();
    Asteroid.list[self.id] = self;
    return self;
}

Asteroid.list = {};
