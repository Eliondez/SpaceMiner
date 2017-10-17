var Ship = function(context) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        x: Math.random() * 700,
        y: Math.random() * 500,
        targetPos: {
            x: this.x,
            y: this.y
        },
        maxVel: 0.5,
        xVel: 0,
        yVel: 0,
        hovered: false,
        selected: true,
        maxRange: 60,
        cargo: {
            max: 100,
            current: 33
        },
        laserList: [],
        workStatus: 0,
        update: function() {

            var dist = Math.hypot(self.x - self.targetPos.x, self.y - self.targetPos.y);
            if ( dist > 2) {
                var ang = Math.atan2(self.targetPos.y - self.y , self.targetPos.x - self.x);
                self.xVel = self.maxVel * Math.cos(ang);
                self.yVel = self.maxVel * Math.sin(ang);
                self.x += self.xVel;
                self.y += self.yVel;
                self.moving = true;
                if (self.laserList.lenght > 0) {
                    var dist = Math.hypot(self.laserList[0].target.x - self.x, self.laserList[0].target.y - self.y);
                    if (dist > self.maxRange)
                        self.stopMine();
                }

            } else {
                self.moving = false;
            }
        },
        render: function() {
            var ctx = context;
            var indRadius = 10;
            if (self.selected)
                indRadius = 12;

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

            ctx.beginPath();
            ctx.fillStyle = '#333';
            ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = '#333';
            ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            // progress bar
            ctx.fillStyle = 'yellow';
            ctx.moveTo(self.x, self.y);
            ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2 * self.workStatus);
            // ctx.moveTo(self.x, self.y);
            // ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = '#9f9';
            ctx.arc(self.x, self.y, 7, 0, Math.PI * 2);
            ctx.fill();
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
        }
    };
    Ship.list[self.id] = self;
    return self;
};

Ship.list = {};
