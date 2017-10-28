var Asteroid = function(params) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        resLeft: params.resLeft || 100,
        name: "Arcanor",
        x: params.x,
        y: params.y,
        radius: 0,
        currentTime: 0,
        currentFrame: Math.floor(Math.random() * 19),
        // rotation: Math.random() * Math.PI,
        hovered: false,
        init: function() {
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
            var ctx = params.context;
            var imageXSlide = Math.floor(self.currentFrame % 5);
            var imageYSlide = Math.floor(self.currentFrame / 5);
            var size = self.radius * 2;
            ctx.save();
            ctx.beginPath();
            ctx.translate(self.x, self.y);
            // ctx.rotate(self.rotation);
            var frameSize = 71;
            ctx.drawImage(self.image, 3 + imageXSlide * frameSize , 3 + imageYSlide * frameSize, frameSize, frameSize, -size/2,-size/2, size, size);
            ctx.restore();
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
                for (item in Asteroid.liist) {
                    if (Asteroid.liist[item] == self) {
                        Asteroid.liist.splice(item, 1);
                    }
                }
                delete Asteroid.list[self.id];
            } else {
                self.radius = 5 + self.resLeft / 10; 
            }
            return { mined: res, resLeft: self.resLeft };
        },
        getDistance: function(target) {
            return Math.hypot(self.x - target.x, self.y - target.y);
        }
    };
    self.init();
    Asteroid.list[self.id] = self;
    Asteroid.liist.push(self);
    return self;
}
Asteroid.liist = [];
Asteroid.list = {};

Asteroid.makeCluster = function(context, totalRes, xCenter, yCenter, width, height) {
    var resLeftToGenerate = totalRes;
    while (resLeftToGenerate > 0) {
        var x = Math.random()*width + xCenter - width / 2;
        var y = Math.random()*height + yCenter - height / 2;
        var resLeft = Math.random() * 300 + 100;
        // var resLeft = Math.random() * 100;
        // var x = xCenter + (Math.random() * 2 * delta - delta)
        // var y = yCenter + (Math.random() * 2 * delta - delta)
        var ast = new Asteroid({x: x, y: y, context: context, resLeft: resLeft });
        resLeftToGenerate -= resLeft;
    }
}
