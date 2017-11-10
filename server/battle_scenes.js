"use strict";
var Battle_scenes = (function() {
  var scenes = {
    4: {
      id: 4,
      objects: {
        4: {
          id: 4,
          name: "aazaa",
          owner: {
            name: 'elion',
            id: 2
          },
          x: 600,
          y: 400,
          targetPos: {
            x: Math.floor(Math.random() * 500 + 150),
            x: Math.floor(Math.random() * 500 + 150)
          },

          vel: 1.1
        }
      },
      maxId: 4
    },
    3: {
      id: 3,
      objects: {
        4: {
          id: 4,
          name: "aazaa",
          owner: {
            name: 'elion',
            id: 2
          },
          x: 600,
          y: 400,
          targetPos: {
            x: Math.floor(Math.random() * 500 + 150),
            x: Math.floor(Math.random() * 500 + 150)
          },
          vel: 1.1
        }
      },
      maxId: 4
    },
    2: {
      id: 2,
      objects: {
        4: {
          id: 4,
          name: "aazaa",
          owner: {
            name: 'elion',
            id: 2
          },
          x: 600,
          y: 400,
          targetPos: {
            x: Math.floor(Math.random() * 500 + 150),
            x: Math.floor(Math.random() * 500 + 150)
          },
          vel: 1.1
        }
      },
      maxId: 4
    }
  }

  var getScenes = function() {
    return scenes;
  }

  var updateScenes = function() {
    var packet = [];
    for (var i in scenes) {
      var scene = scenes[i];
      for (var j in scene.objects) {
        var obj = scene.objects[j];
        var dist = Math.hypot(obj.targetPos.y - obj.y, obj.targetPos.x - obj.x);
        if (dist > 5) {
          var angle = Math.atan2(obj.targetPos.y - obj.y, obj.targetPos.x - obj.x);
          obj.x += obj.vel * Math.cos(angle);
          obj.y += obj.vel * Math.sin(angle);
        } 
        // else {
        //   obj.vel = Math.ceil(Math.random() * 3);
        //   obj.targetPos.x = Math.floor(Math.random() * 500 + 150);
        //   obj.targetPos.y = Math.floor(Math.random() * 500 + 150);
        // }
        
        var packet_obj = {
          sceneId: scene.id,
          objId: obj.id,
          x: obj.x,
          y: obj.y,
          targetPos: obj.targetPos
        }
        packet.push(packet_obj);
      }
    }
    return packet;
  }


  var addObjectToScene = function(obj, sceneId) {
    var scene = scenes[sceneId];
    if (scene) {
      scene.objects[obj.id] = obj;
    }
  }

  return {
    getScenes: getScenes,
    updateScenes: updateScenes,
    addObjectToScene: addObjectToScene
  }
})()

module.exports = Battle_scenes;