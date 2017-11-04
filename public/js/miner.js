"use strict";

var miner = (function () {

  var resizeCanvas = function() {
    miner.canvas.width = $('#game_col').width() - 2;
    miner.canvas.height = window.innerHeight - 80;
  }

  var init = function() {
    miner.canvas = document.getElementById("ctx");
    window.addEventListener('resize', function(e) {
      resizeCanvas();
    })
    console.log("Main module inited!");


    
    miner.sc = {
      x: 100,
      y: 100,
      width: 600,
      height: 600,
      objs: []
    }

    for (var i = 0; i < 30; i++) {
      for (var j = 0; j < 30; j++) {
        var obj = {
          id: 10 * i + j,
          x: i * miner.sc.width / 30,
          y: j * miner.sc.height / 30,
          size: 1
        }
        miner.sc.objs.push(obj);
      }
    }

    var camToScene = function(cam, coord) {
      var res = {};
      res.x = coord.x/cam.scale + cam.x;
      res.y = coord.y/cam.scale + cam.y;
      return res;
    }

    miner.cam = {
      x: 10,
      y: 10,
      width: miner.canvas.width,
      height: miner.canvas.height,
      inpH: miner.canvas.width / 1,
      inpW: miner.canvas.height / 1,
      outH: miner.canvas.width,
      outW: miner.canvas.height,
      scale: 1,
      setScale: function(scale) {
        var anchor = camToScene(miner.cam, miner.mouseHandler);
        console.log(anchor);
        var scaleCoef = scale / this.scale;
        this.x = anchor.x - scaleCoef * anchor.x + scaleCoef * this.x;
        this.y = anchor.y - scaleCoef * anchor.y + scaleCoef * this.y;
        this.scale = scale;
      }
    }

    miner.renderer = {
      camera: miner.cam,
      scene: miner.sc,
      canvas: miner.canvas,
      ctx: miner.canvas.getContext('2d'),
      camToScene: function(position) {
        var res = {};
        res.x = position.x/this.camera.scale + this.camera.x;
        res.y = position.y/this.camera.scale + this.camera.y;
        return res;
      },
      render: function() {


        var ctx = this.ctx;

        

        // var deltaX = this.camera.width / 2 -  (this.camera.x - 0);
        // var deltaY = this.camera.height / 2 - (this.camera.y - 0);
        ctx.clearRect(0,0, this.canvas.width , this.canvas.height);
        ctx.beginPath();
        ctx.strokeRect(
          (0.5 - this.camera.x) * this.camera.scale, 
          (0.5 - this.camera.y) * this.camera.scale, 
          this.scene.width * this.camera.scale, 
          this.scene.height * this.camera.scale);

        for (var i in this.scene.objs) {
          ctx.beginPath();
          var obj = this.scene.objs[i];
          var gray = Math.floor(Math.random() *255);
          // console.log(i / 100);
          ctx.fillStyle = 'rgba(0, 0, 0, ' + obj.id / 900 + ')';
          ctx.fillRect(
            (obj.x  - this.camera.x) * this.camera.scale,
            (obj.y  - this.camera.y) * this.camera.scale,
            20 * this.camera.scale,
            20 * this.camera.scale
          )
        }
      }
    }

    var render = function() {
      miner.renderer.render();
    }

    miner.account.init();
    miner.mouseHandler.init();
    miner.connector.init();
    resizeCanvas();

    setInterval(function() {
      render();
    }, 1000/60);

    // var iter = 0;
    // setInterval(function() {
    //   miner.cam.x = miner.sc.objs[iter].x;
    //   miner.cam.y = miner.sc.objs[iter].y;
    //   iter += 1;
    //   if (iter > 2) {
    //     iter = 0;
    //   }
    // }, 3000)


  }

  return { init: init };
})();