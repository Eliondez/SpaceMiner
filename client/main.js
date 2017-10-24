$(function() {
    Vue.component('simple-counter', {
        template: '<button v-on:click="counter += 1">{{ counter }}</button>',
        data: function () {
          return {
              counter: 1
          }
        }
    });

    var ships = [];
    var asteroids = [];
    
    Vue.component('overview', {
        template: `<div>
                     <div v-for="ship in myShips">123123</div>
                </div>`,
        computed: {
            myShips: function() {
                return ships;
            }
        }
    });
    
    var app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!',
            ships: ships,
            asteroids: Asteroid.liist,
            overviewShip: null,
            overviewSortCol: 'dist',
            overviewSortDesc: false
        },
        methods: {
            resetShip(ship) {
                ship.x = 100;
                ship.y = 100;
            },
            selectShip(ship) {
                ship.selected = !ship.selected;
            },
            stopShip(ship) {
                ship.stop();
            },
            selectForOverview(ship) {
                this.overviewShip = ship;
            },
            setSortCol(col) {
                if (this.overviewSortCol == col) {
                    this.overviewSortDesc = !this.overviewSortDesc;
                } else {
                    this.overviewSortCol = col;
                }
            }
        },
        computed: {
            overviewList: function() {
                var res = [];
                for (ast in app.asteroids) {
                    var item = {
                        item: app.asteroids[ast],
                        dist: parseInt(app.asteroids[ast].getDistance(this.overviewShip))
                    }
                    res.push(item);
                }
                res.sort(function(a, b) {
                    if (a[app.overviewSortCol] > b[app.overviewSortCol]) {
                        if (!app.overviewSortDesc)
                            return 1;
                        else
                            return -1;
                    } else {
                        if (!app.overviewSortDesc)
                            return -1;
                        else
                            return 1;
                    }
                    return 0;
                });
                return res;
            }
        }
    })

    

    var canvas = document.getElementById("ctx")
    var ctx = canvas.getContext("2d");

    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        handleClick(e);
    })

    document.addEventListener('keydown', function(e) {
        keysHandle(e);
    })
    document.addEventListener('keyup', function(e) {
        keysHandle(e);
    })

    var keysHandle = function(e) {
        var isPressed = e.type == 'keydown';
        var keys = {
            "KeyS": 'back',
            "KeyW": 'front',
            "KeyA": 'left',
            "KeyD": 'right'
        };
        var direction = keys[e.code];
        if (direction) {
            for (var i in Ship.list) {
                if (Ship.list[i].selected) {
                    Ship.list[i].thurst(direction, isPressed);
                }
            }
        }
        return;
    }

    var handleClick = function(e) {
        if (e.button == 0) {
            // left click handler
        } else if (e.button == 2) {
            // right click handler
            var selectedUnits = 0;
            for (var i in Ship.list) {
                if (Ship.list[i].selected) {
                    selectedUnits += 1;
                }
            }
            var hoveredUnits = 0;
            for (var i in Asteroid.list) {
                if (Asteroid.list[i].hovered) {
                    hoveredUnits += 1;
                }
            }
            if (selectedUnits > 0 && hoveredUnits > 0) {
                console.log("Make some ACTIONS!");
                var targetAster = null;
                for (var i in Asteroid.list) {
                    var aster = Asteroid.list[i];
                    if (aster.hovered) {
                        targetAster = aster;
                        break;
                    }
                }
                if (!targetAster)
                    return;
                for (var i in Ship.list) {
                    if (Ship.list[i].selected) {
                        // var res = Ship.list[i].addLaser(targetAster);
                        Ship.list[i].addOrder({ type: 'mine', target: targetAster});
                        // if (!res.ok) {
                        //     console.log(res.error);
                        //     if (res.error == 'cant reach') {
                        //         Ship.list[i].addOrder({ type: 'move', target: { x: targetAster.x, y: targetAster.y}});
                        //     }
                        // }
                        
                    }
                }
                return;                
            }
            for (var i in Ship.list) {
                var ship = Ship.list[i];
                if (ship.selected) {
                    ship.addOrder({ type: 'rotate', angle: Math.atan2(mousePos.x - ship.x, ship.y - mousePos.y)});
                }
            }
        }
    }

    var selectionRect = {
        active: false,
        startX: 0,
        startY: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        fillColor: 'rgba(1,1,1,0.3)'
    }

    canvas.addEventListener('mousedown', function(e) {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
        if (e.button == 0) {
            selectionRect.active = true;
            selectionRect.startX = mousePos.x;
            selectionRect.startY = mousePos.y;
        }
    })

    canvas.addEventListener('mouseleave', function(e) {
        if (selectionRect.active) {
            onMouseUp(e);
        }
    })

    canvas.addEventListener('mouseup', function(e) {
        onMouseUp(e);
    });

    var onMouseUp = function(e) {
        if (e.button == 0) {
            for (var i in Ship.list) {
                var ship = Ship.list[i];
                if (ship.hovered) {
                    ship.hovered = false;
                    ship.selected = true;
                } else {
                    ship.selected = false;
                }
            }
        }
        selectionRect.active = false;
    }

    canvas.addEventListener('click', function(e) {
        handleClick(e);
    })

    canvas.addEventListener('mousemove', function(e) {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
        checkHovers();
    })
    ctx.font = '30px Arial';
    var counter = 0;
    // var socket = io();

    var canvasWidth = 800;
    var canvasHeight = 500;
    var gridStep = 20;
    var gridVertLines = canvasWidth / gridStep;
    var gridHorizLines = canvasHeight / gridStep;

    var mousePos = {
        x: 0,
        y: 0
    }

    var clearCanvas = function() {
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        ctx.beginPath();
        ctx.rect(0,0,canvasWidth, canvasHeight);
        ctx.fillStyle = '#222';
        ctx.fill();
    }

    var drawGrid = function() {
        for (var i = 0; i < gridVertLines; i++) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.moveTo(i * gridStep + 0.5, 0 + 0.5);
            ctx.lineTo(i * gridStep + 0.5, canvasHeight + 0.5);
            ctx.stroke();
        }

        for (var i = 0; i < gridHorizLines; i++) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.moveTo(0 + 0.5, i * gridStep + 0.5);
            ctx.lineTo(canvasWidth + 0.5, i * gridStep + 0.5);
            ctx.stroke();
        }
    }

    var checkHovers = function() {
        if (selectionRect.active) {
            for (var i in Ship.list) {
                var ship = Ship.list[i];
                if (
                    ship.x >= selectionRect.left &&
                    ship.x <= selectionRect.right &&
                    ship.y <= selectionRect.bottom &&
                    ship.y >= selectionRect.top 
                ) {
                    ship.hovered = true;
                } else {
                    ship.hovered = false;
                }
            }
        } else {
            for (var i in Ship.list) {
                var ship = Ship.list[i];
                var dist = Math.hypot(mousePos.x - ship.x, mousePos.y - ship.y);
                if (dist < 9)
                    ship.hovered = true;
                else
                    ship.hovered = false;
            }
        }
        
        for (var i in Asteroid.list) {
            var asteroid = Asteroid.list[i];
            var dist = Math.hypot(mousePos.x - asteroid.x, mousePos.y - asteroid.y);
            if (dist < asteroid.radius)
                asteroid.hovered = true;
            else
                asteroid.hovered = false;
        }
    }

    var drawSelectionBox = function() {
        if (selectionRect.active) {
            ctx.beginPath();
            selectionRect.top = Math.min(selectionRect.startY + 0.5, mousePos.y + 0.5);
            selectionRect.left = Math.min(selectionRect.startX + 0.5, mousePos.x + 0.5);
            selectionRect.right = Math.max(selectionRect.startX + 0.5, mousePos.x + 0.5);
            selectionRect.bottom = Math.max(selectionRect.startY + 0.5, mousePos.y + 0.5);
            ctx.rect(selectionRect.left,selectionRect.top,selectionRect.right - selectionRect.left,selectionRect.bottom - selectionRect.top);
            ctx.strokeStyle = selectionRect.borderColor;
            ctx.strokeWidth = selectionRect.borderWidth;
            ctx.fillStyle = selectionRect.fillColor;
            ctx.fill();
            ctx.stroke();
        }
    }

    for (var i = 0; i < 3; i++) {
        var ship = new Ship(ctx, i);
        ships.push(ship);
    }


    Asteroid.makeCluster(ctx, 2500, 350, 250, 250, 100);
    // var ater = new Asteroid({x: 350, y: 250, context: ctx, resLeft: 200 });
    // for (var i = 0; i < 13; i++) {
    //    var ater = new Asteroid(ctx);
    // }

    
   
    
    var render = function() {
        clearCanvas();
        drawGrid();
        for (var i in MineLaser.list) {
            var laser = MineLaser.list[i];
            laser.update();
            laser.render();
        }

        for (var k in Asteroid.list) {
            // var aster = Asteroid.list[k];
            Asteroid.list[k].update();
            Asteroid.list[k].render();
            // console.log(aster);
            // aster.update();
            // aster.render();
        }

        for (var i in Ship.list) {
            var ship = Ship.list[i];
            ship.update();
            ship.render();
        }
        drawSelectionBox();
    }

    setInterval(render, 20);
});