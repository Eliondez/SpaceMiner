var Explosion = function(params) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        x: params.x,
        y: params.y,
        scale: params.scale || 1,
        currentTime: 0,
        currentFrame: 0,
        init: function() {
            self.image = new Image(1024, 1024);   // using optional size for image
            self.image.src = './public/img/explosion.png';
        },
        update: function() {
            self.currentTime += 1;
            if (self.currentTime >= 1) {
                self.currentTime = 0;
                self.currentFrame += 1;
            }
            if (self.currentFrame >= 38)
                delete Explosion.list[self.id];
        },
        render: function() {
            var ctx = params.context;
            var imageXSlide = Math.floor(self.currentFrame % 8);
            var imageYSlide = Math.floor(self.currentFrame / 8);
            var frameSize = 128;
            var size = frameSize * self.scale;
            ctx.save();
            ctx.beginPath();
            ctx.translate(self.x, self.y);
            ctx.drawImage(self.image, imageXSlide * frameSize , imageYSlide * frameSize, frameSize, frameSize, -size/2,-size/2, size, size);
            ctx.restore();
        }
    };
    self.init();
    Explosion.list[self.id] = self;
    return self;
}
Explosion.list = {};
