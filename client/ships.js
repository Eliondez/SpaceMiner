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
            x: 300 + 50 * xNum,
            y: 450,
        },
        isOrca: isOrca || false,
        hp: 100,
        maxHp: 100,
        maxVel: 0.5,
        hovered: false,
        selected: true,
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
            
            // var distToUnload = Math.hypot(self.x - 250, self.y - 250);
            // console.log(distToUnload);
            // self.unload.canUnload = distToUnload <= self.unload.unloadDistance;

            var delta = self.desiredAngle - self.angle;
            if (Math.abs(delta) < 0.02 )
                self.angle = self.desiredAngle;
            else {         
                if (delta > 0) {
                    if (delta < Math.PI)
                        self.angle += 0.013;
                    else
                        self.angle -= 0.013;
                } else {
                    if (delta > -Math.PI)
                    self.angle -= 0.013;
                else
                    self.angle += 0.013;
                }
            }
            self.normalizeAngles();
 
           
            
            if (Math.abs(self.yVel) > 0.05) 
                self.yVel *= 0.99;
            if (Math.abs(self.xVel) > 0.05) 
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
            // ctx.beginPath();
            // ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            // ctx.fill();
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
                // ctx.beginPath();
                // ctx.strokeStyle = '#ddd';
                // ctx.arc(self.x, self.y, 22, 0, Math.PI * 2);
                // ctx.stroke();
                
                // cargo section
                ctx.beginPath();
                ctx.fillStyle = 'yellow';
                ctx.rect(self.x - 10, self.y + 20, 20 * (self.cargo.current / self.cargo.max), 5);
                ctx.fill();
                ctx.beginPath();
                ctx.strokeStyle = '#ddd';
                ctx.rect(self.x - 10, self.y + 20, 20, 5);
                ctx.stroke();

                // ctx.beginPath();
                // ctx.setLineDash([3, 6]);
                // ctx.strokeStyle = 'rgba(100, 100, 100, 0.4)';
                // ctx.arc(self.x, self.y, self.maxRange, 0, Math.PI * 2);
                // ctx.stroke();
                // ctx.setLineDash([]);
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
                self.moveTo(self.currentOrder.target.x, self.currentOrder.target.y);
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
            var bullet = new Bullet(context, self, angle);
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
		}
    };
    self.init();
    Ship.list[self.id] = self;
    return self;
};

Ship.list = {};

var OrcaShip = function() {

}
