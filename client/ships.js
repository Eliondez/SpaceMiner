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

var Ship = function(context, xNum, isOrca) {
    var self = {
        id: "" + Math.floor(10000000 * Math.random()),
        x: 300 + 50 * xNum,
        y: 270,
        targetPos: {
            x: Math.random() * 700,
            y: Math.random() * 500
        },
        isOrca: isOrca || false,
        hp: 100,
        maxHp: 100,
        maxVel: 0.5,
        hitboxRadius: 15,
        hovered: false,
        selected: true,
        reload: {
            max: 200,
            current: 0
        },
        maxRange: 160,
        unload: {
            canUnload: true,
            unloadDistance: 50
        },
        cargo: {
            max: 700,
            current: 0
        },
        laserList: [],
        currentOrder: null,
        workStatus: 0,
        angle: 0,
        desiredAngle: 0,
        currentSpeed: 0,
        thurstPower: 0.05,
        thurstUp: false,
        thurstBack: false,
        thurstRotRight: false,
        thurstRotLeft: false,
        yVel: 0,
        xVel: 0,
        rotVel: 0,
        maxRotVel: 0.03,
        init: function() {
            self.image = new Image(46, 71);   // using optional size for image
            
            if (self.isOrca) {
                self.scale = 0.4;
                self.image.src = '2.png';
            } else {
                self.scale = 0.5;
                self.image.src = '2.png';
            }
            
            self.image.width = 46;
            self.image.height = 71;
        },
        update: function() {
            if (self.reload.current > 0) {
                self.reload.current -= 10;
            }
            var dist = Math.hypot(self.x - self.targetPos.x, self.y - self.targetPos.y);
            if (dist > 5) {
                self.desiredAngle = self.angleTo(self.targetPos);
                if (Math.abs(self.desiredAngle - self.angle) < 0.5 && dist > 175) {
                    self.thurstUp = true;
                    self.thurstBack = false;
                } else if (dist < 100) {
                    self.thurstUp = false;
                    self.thurstBack = true;
                } else {
                    self.thurstUp = false;
                    self.thurstBack = false;
                }
            }

            var delta = self.desiredAngle - self.angle;
            if (Math.abs(delta) < 0.02 )
                self.angle = self.desiredAngle;
            else {         
                if (delta > 0) {
                    if (delta < Math.PI)
                        self.angle += self.maxRotVel;
                    else
                        self.angle -= self.maxRotVel;
                } else {
                    if (delta > -Math.PI)
                    self.angle -= self.maxRotVel;
                else
                    self.angle += self.maxRotVel;
                }
            }
            self.normalizeAngles();
 
           
            
            if (Math.abs(self.yVel) > 0.01) 
                self.yVel *= 0.99;
            if (Math.abs(self.xVel) > 0.01) 
                self.xVel *= 0.99;

            if (Math.abs(self.rotVel) > 0.001)
                self.rotVel *= 0.95;

            if (self.thurstRotLeft) {
                self.rotVel -= self.thurstPower * 0.05;
            }

            if (self.thurstRotRight) {
                self.rotVel += self.thurstPower * 0.05;
            }

            if (self.thurstUp) {
                self.xVel += self.thurstPower * Math.sin(self.angle);
                self.yVel += self.thurstPower * Math.cos(self.angle);
            }
            if (self.thurstBack) {
                self.xVel -= self.thurstPower * Math.sin(self.angle);
                self.yVel -= self.thurstPower * Math.cos(self.angle);
            }
            self.angle += self.rotVel;
            self.y -= self.yVel;
            self.x += self.xVel;
            
            if (self.currentOrder && self.moving && self.currentOrder.type == "mine") {
                var can_reach = self.currentOrder.target.getDistance(self) <= self.maxRange;
                if (can_reach) {
                    self.stop();
                    self.addLaser(self.currentOrder.target);
                }
            }
        },
        render: function() {
            var ctx = context;

            ctx.beginPath();
            ctx.fillStyle = '#933';
            ctx.arc(self.targetPos.x, self.targetPos.y, 2, 0, Math.PI * 2);
            ctx.fill();

            var indRadius = 10;
            if (self.selected)
                indRadius = 12;

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

            ctx.beginPath();
            if (self.hovered || self.selected) {
                ctx.strokeStyle = 'rgba(100, 100, 100, 0.6)';    
            } else {
                ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
            }
            ctx.setLineDash([3, 6]);
            ctx.arc(0, 0, self.maxRange, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.setLineDash([3, 6]);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -self.maxRange);
            ctx.stroke();
            ctx.setLineDash([]);

            if (self.hovered || self.selected) {
                ctx.beginPath();
                ctx.fillStyle = 'yellow';
                var ang = self.desiredAngle - self.angle;
                ctx.arc(Math.sin(ang) * self.maxRange, -Math.cos(ang) * self.maxRange, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // hp-bar section
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.rect(self.x - 10, self.y - 30, 20 * (self.hp / self.maxHp), 5);
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = '#ddd';
            ctx.rect(self.x - 10, self.y - 30, 20, 5);
            ctx.stroke();

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
            if (self.hovered || self.selected) {
                ctx.beginPath();
                ctx.fillStyle = 'yellow';
                ctx.rect(self.x - 10, self.y + 20, 20 * (self.cargo.current / self.cargo.max), 5);
                ctx.fill();
                ctx.beginPath();
                ctx.strokeStyle = '#ddd';
                ctx.rect(self.x - 10, self.y + 20, 20, 5);
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
            return self.cargo.max - self.cargo.current;
        },
        stop: function() {
            self.xVel = 0;
            self.yVel = 0;
            self.rotVel = 0;
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
                console.log("Move order!");
                self.targetPos = self.currentOrder.target;
                // self.moveTo(self.currentOrder.target.x, self.currentOrder.target.y);
            } else if (self.currentOrder.type == "mine" && !self.cargoIsFull()) {
                var can_reach = self.currentOrder.target.getDistance(self) <= self.maxRange;
                if (!can_reach) {
                    self.moveTo(self.currentOrder.target.x, self.currentOrder.target.y);
                } else {
                    self.addLaser(self.currentOrder.target);
                }
            } else if (self.currentOrder.type == "rotate") {
                self.desiredAngle = self.currentOrder.angle;
            }
        },
        thurst: function(direction, isOn) {
            if (direction == 'left') {
                // this.thurstRotLeft = isOn;
                this.desiredAngle -= 0.05;
            } else if (direction == 'right') {
                this.desiredAngle += 0.05;
                // this.thurstRotRight = isOn;
            } else if (direction == 'front') {
                this.thurstUp = isOn;
            } else if (direction == 'back') {
                this.thurstBack = isOn;
            }
        },
        normalizeAngles: function() {
            if (self.angle > Math.PI ) {
                self.angle = self.angle - Math.PI * 2;
            }
            if (self.angle < -Math.PI) {
                self.angle = Math.PI * 2 + self.angle;
            }
            if (self.desiredAngle > Math.PI) {
                self.desiredAngle = self.desiredAngle - Math.PI * 2;
            }
            if (self.desiredAngle < -Math.PI) {
                self.desiredAngle = Math.PI * 2 + self.desiredAngle;
            }
        },
        unload: function() {
            console.log('Разгружено ' + parseInt(self.cargo.current) + ' единиц руды.');
            self.cargo.current = 0;
        },
        pewpew: function(angle) {
            if (self.reload.current <= 0) {
                var bullet = new Bullet(context, self, self.angle );
                self.reload.current = self.reload.max;
            }
        },
		damage: function(dmg) {
            self.hp = Math.max(0, self.hp - dmg);
            if (self.hp == 0) {
                var expl = new Explosion({
                    context: context,
                    x: self.x,
                    y: self.y,
                    scale: 0.5
                });
                delete Ship.list[self.id];
            }
        },
        angleTo: function(target) {
            return Math.atan2(target.x - self.x, self.y - target.y)
        },
        appendForce: function(angle, val) {
            self.xVel += val * Math.sin(angle);
            self.yVel += val * Math.cos(angle);
        }
    };
    self.init();
    Ship.list[self.id] = self;
    return self;
};

Ship.list = {};

var OrcaShip = function() {

}
