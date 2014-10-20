/*global Game*/
/*global player*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;

var spaceKey;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.camera = {x:0,y:0};
  
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('town');
    this.map.addTilesetImage('RPGTown');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();
    this.layer2 = this.map.createLayer('layer2');
    this.layer2.resizeWorld();


    // Gray Brick
    this.map.setCollision([13,14,15]);

    // Trees
    this.map.setCollision([16,17,18],true,'layer2');
    
    // this.map.setCollision(21);
    this.map.setCollision(22);
    this.map.setCollision(23);
    // this.map.setCollision(24);
    

    // TODO: Roof tiles should overlap sprite
    // Roof 
    // this.map.setCollision(25);
    // this.map.setCollision(26);
    // this.map.setCollision(27);

    // this.map.setCollision(28);
     
    // Signs
    this.map.setCollision(33,true,'layer2');

    // Initial Player Position by tile
    player.tilex = 6;
    player.tiley = 6;

    player.create();
    // Music
    this.music = this.game.add.sound('music');
    this.music.volume = 0.5;
    this.music.play('',0,1,true);

    // dialoguePanel = this.game.add.sprite(0,0,'RPGTextbox'); 
    dialoguePanel = this.game.add.sprite(0,8*64,'RPGTextbox'); 
    dialoguePanel.hidden = false;
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },
  update: function() {
    this.game.physics.arcade.collide(player.sprite, this.layer1);
    this.game.physics.arcade.collide(player.sprite, this.layer2);

    spaceKey.onDown.add(this.dialoguePanel, this);

    this.updateCamera();
    player.update();
   
  },
  updateCamera: function() {
    if (this.tweening) {
      return;
    }
    this.tweening = true;
    
    var speed = 700;
    var toMove = false;

    if (player.sprite.y > this.game.camera.y + Game.h) {
      this.camera.y += 1;
      toMove = true;
    }
    else if (player.sprite.y < this.game.camera.y) {
      this.camera.y -= 1;
      toMove = true;
    }
    else if (player.sprite.x > this.game.camera.x + Game.w) {
      this.camera.x += 1;
      toMove = true;
    }
    else if (player.sprite.x < this.game.camera.x) {
      this.camera.x -= 1;
      toMove = true;
    }

    if (toMove) {
      var t = this.game.add.tween(this.game.camera).to({x:this.camera.x*Game.w, y:this.camera.y*Game.h}, speed);
      t.start();
      t.onComplete.add(function(){this.tweening = false;}, this);
    }
    else {
      this.tweening = false;
    }
  },
  dialoguePanel: function() {
    if (dialoguePanel.hidden === true) {
      // Position Hidden Panel before tween
      dialoguePanel.x = this.camera.x*Game.w;
      dialoguePanel.y = this.camera.y*Game.h+12*64;
      dialoguePanel.alpha = 100;
      
      var t = this.game.add.tween(dialoguePanel).to({x: this.camera.x*Game.w, y: this.camera.y*Game.h+8*64}, 250);
      t.start();
      t.onComplete.add(function(){dialoguePanel.hidden = false;}, this);

    }else {
      var t = this.game.add.tween(dialoguePanel).to({x: this.camera.x*Game.w, y: this.camera.y*Game.h+12*64}, 250);
      t.start();
      t.onComplete.add(function(){
        dialoguePanel.alpha = 0;
        dialoguePanel.hidden = true;
      }, this);
    }
  }
   

};
