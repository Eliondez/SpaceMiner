var Asteroid = function(params) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        resLeft: params.resLeft || 100,
        name: "Veldspar",
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
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.rect(self.x-size/2 + 2, self.y-size/2 + 2, size, size);
            ctx.stroke();
            ctx.beginPath();
            
            
            // ctx.save();
            // ctx.translate(self.x-size/2, self.y-size/2);
            // ctx.rotate(self.rotation*Math.PI/180);
            var frameSize = 71;
            ctx.drawImage(self.image, 3 + imageXSlide * frameSize , 3 + imageYSlide * frameSize, frameSize, frameSize, self.x-size/2, self.y-size/2, size, size);
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
            return res;
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

Asteroid.makeCluster = function(context, totalRes, xCenter, yCenter) {
    var resLeftToGenerate = totalRes;
    while (resLeftToGenerate > 0) {
        var delta = 200;
        var x = Math.random()*delta + Math.random()*delta + xCenter - delta;
        var y = Math.random()*delta + Math.random()*delta + yCenter - delta;
        
        var resLeft = Math.random() * 100 + 100;
        // var resLeft = Math.random() * 100;
        // var x = xCenter + (Math.random() * 2 * delta - delta)
        // var y = yCenter + (Math.random() * 2 * delta - delta)
        var ast = new Asteroid({x: x, y: y, context: context, resLeft: resLeft });
        resLeftToGenerate -= resLeft;
    }
}
