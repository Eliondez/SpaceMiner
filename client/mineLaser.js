var MineLaser = function(context, from, to) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        counter: 0,
        minWidth: 1,
        maxWidth: 2,
        currentWidth: 1,
        currentAlpha: 0.5,
        currentTime: 0,
        maxTime: 100,
        parent: from,
        target: to,
        update: function() {
            self.currentTime += 1;
            if (self.currentTime >= self.maxTime) {
                var res = self.target.mineOut(50);
                var cargoIsFull = self.parent.mineTick(res.mined) <= 0;
                console.log(res, cargoIsFull);
                if (res.resLeft > 0 && !cargoIsFull) {
                    console.log('cont dig!');
                    self.currentTime = 0;
                } else {
                    self.parent.stopMine();
                }
            } else {
                self.parent.mineUpdate(self.currentTime / self.maxTime);
            }
            self.counter += 1;
            if (self.counter % 5 == 0) {
                self.currentWidth = Math.random() * (self.maxWidth - self.minWidth) + self.minWidth;
                self.currentAlpha = Math.random() + 0.3;
            }
        },
        render: function() {
            var ctx = context;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.strokeStyle = 'rgba(203, 224, 41, ' + self.currentAlpha + ')';
            ctx.lineCap="round";
            ctx.lineWidth = self.currentWidth
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    };
    MineLaser.list[self.id] = self;
    return self;
};

MineLaser.list = {};