/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('town');
    this.map.addTilesetImage('RPG');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();
    this.layer2 = this.map.createLayer('layer2');
    this.layer2.resizeWorld();

    player.create();
    this.camera = {x:0,y:0};
    // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

  },

  update: function() {
    player.movements();
    
    if (this.tween) {
      return;
    }

    this.tween = true;
    var speed = 600;
    var to_move = false;

    if (player.sprite.y > this.game.camera.y + Game.h) {
      this.camera.y += 1;
      to_move = true;
    }
    else if (player.sprite.y < this.game.camera.y) {
      this.camera.y -= 1;
      to_move = true;
    }
    else if (player.sprite.x > this.game.camera.x + Game.w) {
      this.camera.x += 1;
      to_move = true;
    }
    else if (player.sprite.x < this.game.camera.x) {
      this.camera.x -= 1;
      to_move = true;
    }

    if (to_move) {
      var t = this.game.add.tween(this.game.camera).to({x:this.camera.x*Game.w, y:this.camera.y*Game.h}, speed);
      t.start();
      t.onComplete.add(function(){this.tween = false;}, this);
    }
    else {
      this.tween = false;
    }
    
  },

};
