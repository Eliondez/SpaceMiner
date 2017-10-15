$(function() {

    var canvas = document.getElementById("ctx")
    var ctx = canvas.getContext("2d");

    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        handleClick(e);
    })

    var handleClick = function(e) {
        if (e.button == 0) {
            // left click handler
        } else if (e.button == 2) {
            // right click handler
            var selectedUnits = 0;
            for (var i in Ship.shipList) {
                if (Ship.shipList[i].selected) {
                    selectedUnits += 1;
                }
            }
            var hoveredUnits = 0;
            for (var i in Asteroid.asteroidList) {
                if (Asteroid.asteroidList[i].hovered) {
                    hoveredUnits += 1;
                }
            }
            if (selectedUnits > 0 && hoveredUnits > 0) {
                console.log("Make some ACTIONS!");
                for (var i in Ship.shipList) {
                    if (Ship.shipList[i].selected) {
                        selectedUnits += 1;
                        var laser = new MineLaser(ctx, Ship.shipList[i], aster);
                    }
                }
                return;                
            }
            
            var radius = 15;
            if (selectedUnits > 5) {
                radius = 20;
            }
            if (selectedUnits == 1) {
                radius = 0;
            }
            var ang =  Math.PI * 2 / selectedUnits;
            var currentAng = Math.PI * 2 * Math.random();
            for (var i in Ship.shipList) {
                var ship = Ship.shipList[i];
                if (ship.selected) {
                    var deltaX = Math.cos(currentAng) * radius;
                    var deltaY = Math.sin(currentAng) * radius; 
                    ship.targetPos.x = mousePos.x + deltaX;
                    ship.targetPos.y = mousePos.y + deltaY;
                    currentAng += ang; 
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
        onMouseUp(e);
    })

    canvas.addEventListener('mouseup', function(e) {
        onMouseUp(e);
    });

    var onMouseUp = function(e) {
        if (e.button == 0) {
            for (var i in Ship.shipList) {
                var ship = Ship.shipList[i];
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
            for (var i in Ship.shipList) {
                var ship = Ship.shipList[i];
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
            for (var i in Ship.shipList) {
                var ship = Ship.shipList[i];
                var dist = Math.hypot(mousePos.x - ship.x, mousePos.y - ship.y);
                if (dist < 9)
                    ship.hovered = true;
                else
                    ship.hovered = false;
            }
        }
        
        for (var i in Asteroid.asteroidList) {
            var asteroid = Asteroid.asteroidList[i];
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

    for (var i = 0; i < 5; i++) {
        var ship = new Ship(ctx);
        Ship.shipList.push(ship);
    }

    for (var i = 0; i < 3; i++) {
        var aster = new Asteroid(ctx);
        Asteroid.asteroidList.push(aster); 
    }

   
    
    var render = function() {
        counter += 0.5;
        clearCanvas();
        for (var i in MineLaser.list) {
            var laser = MineLaser.list[i];
            laser.update();
            laser.render();
        }

        for (var i in Ship.shipList) {
            var ship = Ship.shipList[i];
            ship.update();
            ship.render();
        }

        for (var i in Asteroid.asteroidList) {
            var aster = Asteroid.asteroidList[i];
            aster.render();
        }
        
        drawGrid();
        drawSelectionBox();
    }

    setInterval(render, 20);
});