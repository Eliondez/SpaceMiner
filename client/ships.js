var Ship = function(context) {
    var self = {
        id: 1,
        x: Math.random() * 700,
        y: Math.random() * 500,
        targetPos: {
            x: Math.random() * 700,
            y: Math.random() * 500
        },
        maxVel: 0.5,
        xVel: 0,
        yVel: 0,
        hovered: false,
        selected: true,
        laserList: [],
        update: function() {
            var dist = Math.hypot(self.x - self.targetPos.x, self.y - self.targetPos.y);
            if ( dist > 2) {
                var ang = Math.atan2(self.targetPos.y - self.y , self.targetPos.x - self.x);
                self.xVel = self.maxVel * Math.cos(ang);
                self.yVel = self.maxVel * Math.sin(ang);
                self.x += self.xVel;
                self.y += self.yVel;
                self.moving = true;
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
            // ctx.fillStyle = 'yellow';
            // ctx.moveTo(self.x, self.y);
            // ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            // ctx.moveTo(self.x, self.y);
            // ctx.arc(self.x, self.y, indRadius, 0, Math.PI * 2);
            // ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = '#9f9';
            ctx.arc(self.x, self.y, 7, 0, Math.PI * 2);
            ctx.fill();
            if (self.hovered || self.selected) {
                ctx.beginPath();
                ctx.strokeStyle = '#ddd';
                ctx.arc(self.x, self.y, 12, 0, Math.PI * 2);
                ctx.stroke();
            }
        },
        addLaser: function(id) {
            self.laserList.push(id);
        }
    }
    return self;
}

Ship.shipList = [];
