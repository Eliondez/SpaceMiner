var Entity = function(x, y) {
    var self = {
        x: x,
        y: y,
        getDistance: function(target) {
            return Math.hypot(self.x - target.x, self.y - target.y);
        }
    }
    return self;
}

var Ship = function(context, xNum) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        x: 300 + 50 * xNum,
        y: 450,
        targetPos: {
            x: 300 + 50 * xNum,
            y: 450,
        },
        maxVel: 0.5,
        xVel: 0,
        yVel: 0,
        hovered: false,
        selected: true,
        maxRange: 160,
        cargo: {
            max: 100,
            current: 33
        },
        laserList: [],
        currentOrder: null,
        workStatus: 0,
        angle: 0,
        thurst: 0.05,
        thurstUp: false,
        thurstDown: false,
        yVel: 0,
        xVel: 0,
        init: function() {
            self.image = new Image(164, 251);   // using optional size for image
            self.scale = 0.2;
            self.image.src = 'orangeship.png';
            self.image.width = 164;
            self.image.height = 251;
        },
        update: function() {
            if (self.yVel > 0.05)
                self.yVel *= 0.99;

            if (self.thurstUp) {
                self.yVel += self.thurst;
            }
            if (self.thurstDown) {
                self.yVel -= self.thurst;
            }
            self.y -= self.yVel;
            
            if (self.currentOrder && self.moving && self.currentOrder.type == "mine") {
                var can_reach = self.currentOrder.target.getDistance(self) <= self.maxRange;
                if (can_reach) {
                    self.stop();
                    self.addLaser(self.currentOrder.target);
                }
            }
            


            // var dist = Math.hypot(self.x - self.targetPos.x, self.y - self.targetPos.y);
            // if ( dist > 2) {
            //     var ang = Math.atan2(self.targetPos.y - self.y , self.targetPos.x - self.x);
            //     self.xVel = self.maxVel * Math.cos(ang);
            //     self.yVel = self.maxVel * Math.sin(ang);
            //     self.x += self.xVel;
            //     self.y += self.yVel;
            //     self.moving = true;
            //     if (self.laserList.lenght > 0) {
            //         var dist = Math.hypot(self.laserList[0].target.x - self.x, self.laserList[0].target.y - self.y);
            //         if (dist > self.maxRange)
            //             self.stopMine();
            //     }

            // } else {
            //     self.moving = false;
            // }
        },
        render: function() {
            var ctx = context;
            var indRadius = 10;
            if (self.selected)
                indRadius = 12;
            ctx.beginPath();
            ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            ctx.fill();
            // // progress bar
            // ctx.save();
            // // ctx.globalCompositeOperation = 'destination-out';
            // ctx.beginPath();
            // ctx.fillStyle = 'yellow';
            // ctx.moveTo(self.x, self.y);
            // ctx.arc(self.x, self.y, indRadius + 5, 0, Math.PI * 2 * self.workStatus);
            // ctx.fill();
            // ctx.restore();
            ctx.beginPath();
            ctx.save();
            ctx.translate(self.x, self.y);
            ctx.rotate(self.angle);
            ctx.drawImage(
                self.image,
                0,
                0,
                self.image.width,
                self.image.height,
                - self.image.width/2 * self.scale, 
                - self.image.height/2 * self.scale,
                self.image.width * self.scale,
                self.image.height * self.scale);
            ctx.restore();

            if (self.moving) {
                ctx.beginPath();
                ctx.fillStyle = '#933';
                ctx.arc(self.targetPos.x, self.targetPos.y, 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.setLineDash([5, 15]);
                ctx.strokeStyle = "rgba(255,255,255, 0.1)";
                ctx.moveTo(self.x, self.y);
                ctx.lineTo(self.targetPos.x, self.targetPos.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            

            // ctx.beginPath();
            // ctx.fillStyle = '#333';
            // ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            // ctx.fill();

            // ctx.beginPath();
            // ctx.fillStyle = '#333';
            // ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            // ctx.fill();
            
            
            // ctx.beginPath();
            // ctx.fillStyle = '#9f9';
            // ctx.arc(self.x, self.y, 7, 0, Math.PI * 2);
            // ctx.fill();
            if (self.hovered || self.selected) {
                ctx.beginPath();
                ctx.strokeStyle = '#ddd';
                ctx.arc(self.x, self.y, 12, 0, Math.PI * 2);
                ctx.stroke();
                // cargo section
                ctx.beginPath();
                ctx.fillStyle = 'yellow';
                ctx.rect(self.x - 10, self.y + 20, 20 * (self.cargo.current / self.cargo.max), 5);
                ctx.fill();
                ctx.beginPath();
                ctx.strokeStyle = '#ddd';
                ctx.rect(self.x - 10, self.y + 20, 20, 5);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = '#ddd';
                ctx.arc(self.x, self.y, self.maxRange, 0, Math.PI * 2);
                ctx.stroke();
            }
        },
        addLaser: function(target) {
            var dist = Math.hypot(target.x - self.x, target.y - self.y);
            if (dist > self.maxRange)
                return { ok: false, error: "cant reach"};
            if (self.laserList > 0)
                return { ok: false, error: "already mine"};
            var laser = new MineLaser(context, self, target);
            self.laserList.push(laser.id);
            return { ok: true };
        },
        moveTo: function(x, y) {
            self.angle = Math.atan2(y-self.y, x-self.x) + Math.PI /2;
            console.log(self.angle);
            self.targetPos.x = x;
            self.targetPos.y = y;
        },
        stopMine: function() {
            var laser = self.laserList[0];
            delete MineLaser.list[laser];
            self.laserList = [];
            var ind = 0;
            self.workStatus = 0;
        },
        mineUpdate: function(val) {
            self.workStatus = val;
        },
        mineTick: function(val) {
            self.cargo.current = Math.min(self.cargo.current + val, self.cargo.max);
        },
        stop: function() {
            self.targetPos.x = self.x;
            self.targetPos.y = self.y;
        },
        addOrder: function(order) {
            self.currentOrder = order;
            self.processCurrentOrder();
        },
        cargoIsFull: function() {
            return self.cargo.current >= self.cargo.max;
        },
        processCurrentOrder: function() {
            if (self.currentOrder.type == "move") {
                self.moveTo(self.currentOrder.target.x, self.currentOrder.target.y);
            } else if (self.currentOrder.type == "mine" && !self.cargoIsFull()) {
                var can_reach = self.currentOrder.target.getDistance(self) <= self.maxRange;
                if (!can_reach) {
                    self.moveTo(self.currentOrder.target.x, self.currentOrder.target.y);
                } else {
                    self.addLaser(self.currentOrder.target);
                }
            }
        }
    };
    self.init();
    Ship.list[self.id] = self;
    return self;
};

Ship.list = {};
