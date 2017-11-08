"use strict";

miner.scene = (function() {
  var 
  init, 
  canvas,
  canvasW,
  canvasH, 
  ctx, 
  scenes, 
  currentScene, 
  renderScene;
  
  canvasW = 800;
  canvasH = 800;

  currentScene = 0;
  scenes = [
    {
      id: 4,
      objects: [
        {
          id: 2,
          name: "aazaa",
          owner: 5,
          x: 200,
          y: 300
        },
        {
          id: 3,
          name: "aazaa",
          owner: 5,
          x: 250,
          y: 100
        },
        {
          id: 4,
          name: "aazaa",
          owner: 5,
          x: 600,
          y: 400
        }
      ]
    }
  ];

  init = function(canvas_id) {
    console.log("Scene ready");
    canvas = document.getElementById(canvas_id);
    canvas.width = canvasW;
    canvas.height = canvasH;
    ctx = canvas.getContext('2d');
    ctx.strokeRect(100, 100, 300, 300);
  }

  renderScene = function() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    for (var i = 0; i < scenes[currentScene].objects.length; i++) {
      var obj = scenes[currentScene].objects[i];
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(obj.x, obj.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  setInterval(function() {
    renderScene();
  }, 1000/30);


  return {
    init: init
  }
})();
