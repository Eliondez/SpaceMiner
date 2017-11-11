"use strict";

miner.scene = (function() {
  var 
  init, 
  canvas,
  CANVAS_W,
  CANVAS_H, 
  ctx, 
  scenes, 
  currentScene, 
  renderScene,
  selfId,
  updatePositionsFromServer,
  addObjectFromServer,
  renderSelectionBox,
  selectionBox,
  mouseEvent,
  renderGrid,
  setCurrentScene;
  

  selfId = 2;
  CANVAS_W = 800;
  CANVAS_H = 800;

  selectionBox = {
    state: 0,
    initPoint: {
      x: 0,
      y: 0
    },
    mouse: {
      x: 0,
      y: 0
    }
  }

  mouseEvent = function(type, coords) {
    // console.log(type, coords);
    if (type === 'm0d') {
      selectionBox.initPoint = coords;
      selectionBox.state = 1;
    } else if (type === 'mm') {
      if (selectionBox.state === 1) {
        var dist = Math.hypot(selectionBox.initPoint.x - coords.x, selectionBox.initPoint.y - coords.y);
        // console.log(dist);
        if (dist > 2) {
          selectionBox.mouse = coords;
          selectionBox.state = 2;
        }
      } else if (selectionBox.state === 2) {
        selectionBox.mouse = coords;
      } else if (selectionBox.state === 0) {
        for (var id in scenes[currentScene].objects) {
          var obj = scenes[currentScene].objects[id];
          var dist = Math.hypot(obj.x - coords.x, obj.y - coords.y);
          if (dist < 15) {
            obj.hovered = true;
          } else {
            obj.hovered = false;
          }
        }
      }
    } else if (type === "m0u") {
      // if (selectionBox.state === 2) {
      for (var id in scenes[currentScene].objects) {
        var obj = scenes[currentScene].objects[id];
        if (obj.hovered) {
          obj.selected = true;
        } else {
          obj.selected = false;
        }
        obj.hovered = false;
      }
      // }
      selectionBox.state = 0;
    } else if (type === "m2u") {
      console.log("Send command!");
      var packet = {
        sceneId: currentScene,
        command: 'moveto',
        target: coords,
        objects: []
      };
      for (var id in scenes[currentScene].objects) {
        var obj = scenes[currentScene].objects[id]
        if (obj.selected) {
          packet.objects.push(obj.id);
        }
      }
      miner.connector.sendCommand(packet);
      console.log(packet);
    }
  }

  renderSelectionBox = function() {
    if (selectionBox.state === 2) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeStyle = 'white';
      var x0 = Math.min(selectionBox.initPoint.x, selectionBox.mouse.x);
      var y0 = Math.min(selectionBox.initPoint.y, selectionBox.mouse.y);
      var w = Math.abs(selectionBox.initPoint.x - selectionBox.mouse.x);
      var h = Math.abs(selectionBox.initPoint.y - selectionBox.mouse.y);
      ctx.fillRect(x0, y0, w, h);
      ctx.strokeRect(x0 + 0.5, y0 + 0.5, w, h);
      ctx.restore();

      for (var id in scenes[currentScene].objects) {
        var obj = scenes[currentScene].objects[id];
        if (
          obj.x > x0 &&
          obj.x < x0 + w &&
          obj.y > y0 &&
          obj.y < y0 + h
        ) {
          obj.hovered = true;
        } else {
          obj.hovered = false;
        }
      }
    } 
  }

  currentScene = 4;
  scenes = {
    4: {
      id: 4,
      objects: {}
    },
    3: {
      id: 3,
      objects: {}
    },
    2: {
      id: 2,
      objects: {}
    },
  };

  setCurrentScene = function(num) {
    currentScene = num;
  }

  addObjectFromServer = function(msg) {
    var obj = msg.obj;
    obj.hovered = false;
    obj.selected = false;
    scenes[msg.sceneId].objects[obj.id] = obj;

    var keys = Object.keys(scenes[msg.sceneId].objects)
    if (keys.length > 1) {
      var id1 = obj.id;
      var id2 = keys[Math.floor(Math.random() * keys.length)];
      if (id1 != id2) {
        l_controller.createLaser(id1, id2);
      }
    }
  }

  updatePositionsFromServer = function(msg) {
    for (var i in msg) {
      var item = msg[i];
      // console.log(item);
      var obj = scenes[item.sceneId].objects[item.objId];
      if (obj) {
        obj.x = item.x;
        obj.y = item.y;
        obj.targetPos = item.targetPos;
      }
    }
  }

  init = function(canvas_id) {
    console.log("Scene ready");
    canvas = document.getElementById(canvas_id);
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    ctx = canvas.getContext('2d');
    ctx.strokeRect(100, 100, 300, 300);
  }

  var LaserController = function() {
    var nextId = 0;
    var lasers = {};
    var createLaser = function(fromId, toId) {
      var laser = {
        id: nextId,
        from: fromId,
        to: toId,
        width: 1,
        color: 'yellow'
      };
      nextId += 1;
      lasers[laser.id] = laser;
      return laser;
    }

    var removeLaser = function(id) {
      delete lasers[id];
    }

    var getLasers = function() {
      return lasers;
    }

    return {
      createLaser: createLaser,
      removeLaser: removeLaser,
      getLasers: getLasers
    }
  }

  var l_controller = LaserController();

  renderGrid = function() {
    var gridStep = 10;
    var grid_v_lines = CANVAS_W / gridStep;
    var grid_h_lines = CANVAS_H / gridStep;
    ctx.save();
    ctx.beginPath()
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();

    ctx.save()
    ctx.strokeStyle = 'rgba(100,100,100,0.1)';
    for (var i = 0; i < grid_v_lines; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridStep + 0.5, 0);
      ctx.lineTo(i * gridStep + 0.5, CANVAS_H);
      ctx.stroke();
    }
    for (var i = 0; i < grid_h_lines; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * gridStep + 0.5);
      ctx.lineTo(CANVAS_W, i * gridStep + 0.5);
      ctx.stroke();
    }
    ctx.restore();

  }

  renderScene = function() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    renderGrid();
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(96.5, 96.5, 608, 608);

    ctx.save()
    var lasers = l_controller.getLasers();
    var objs = scenes[currentScene].objects;
    for (var i in lasers) {
      var laser = lasers[i];
      ctx.beginPath();
      ctx.strokeStyle = laser.color;
      ctx.lineWidth = laser.width;
      ctx.moveTo(objs[laser.from].x, objs[laser.from].y);
      ctx.lineTo(objs[laser.to].x, objs[laser.to].y);
      ctx.stroke();
    }
    ctx.restore()

    for (var id in scenes[currentScene].objects) {
      var obj = scenes[currentScene].objects[id];
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'orange';
      ctx.arc(obj.targetPos.x, obj.targetPos.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = '#ccc';
      ctx.moveTo(obj.targetPos.x, obj.targetPos.y);
      ctx.lineTo(obj.x, obj.y);
      ctx.stroke();
      ctx.restore();

      if (obj.selected) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.strokeStyle = 'white';
        ctx.arc(obj.x, obj.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } 
      if (obj.hovered) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#222';
        ctx.strokeStyle = 'white';
        ctx.arc(obj.x, obj.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      
      ctx.save();
      ctx.beginPath();
      if (obj.owner.id === selfId) {
        ctx.fillStyle = 'green';
      } else {
        ctx.fillStyle = 'red';
      }
      ctx.arc(obj.x, obj.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    renderSelectionBox();
  }

  setInterval(function() {
    renderScene();
  }, 1000/60);


  return {
    init: init,
    updatePosition: updatePositionsFromServer,
    addObject: addObjectFromServer,
    mouseEvent: mouseEvent,
    setCurrentScene: setCurrentScene
  }
})();