/*global Game*/
/*global player*/
/*global Npc*/

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
    // this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics

    this.npcs = this.game.add.group();
    this.npcs.enableBody = true;
    this.npcs.immovable = true;
  
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('town');
    this.map.addTilesetImage('RPGTown');
    this.map.addTilesetImage('npcs');
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
    this.map.setCollision(25);
    this.map.setCollision(26);
    this.map.setCollision(27);
    this.map.setCollision(52);

    // this.map.setCollision(28);
     
    // Signs
    this.map.setCollision(33,true,'layer2');


    // Load Objects
    this.map.createFromObjects('objects', 52, 'npcs', 16, true, false, this.npcs)
    
    this.npcs.forEach(function(npc) {
      npc = new Npc(game,'mom',npc.x,npc.y,16, npc.script);
        
    }, this);  



    // Initial Player Position by tile
    player.tilex = 6;
    player.tiley = 6;

    player.create();
    // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    dialogue.create();

    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    console.log(spaceKey);

  },

  conversation: function(player,npc) {
    if (spaceKey.isDown && dialogue.hidden) {
        console.log(npc.script);
        dialogue.show(npc.script.split('*'));
    }
  },

  update: function() {
    this.game.physics.arcade.collide(player.sprite, this.layer1);
    this.game.physics.arcade.collide(player.sprite, this.layer2);
    
    this.game.physics.arcade.overlap(player.sprite, this.npcs, this.conversation, null, this);

    if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
      dialogue.hide();
    }

    this.updatecamera();
    player.update();
   
  },
  updatecamera: function() {
    if (this.tweening) {
      return;
    }
    this.tweening = true;
    
    var speed = 700;
    var tomove = false;

    if (player.sprite.y > this.game.camera.y + game.h) {
      game.camera.y += 1;
      tomove = true;
    }
    else if (player.sprite.y < this.game.camera.y) {
      game.camera.y -= 1;
      tomove = true;
    }
    else if (player.sprite.x > this.game.camera.x + game.w) {
      game.camera.x += 1;
      tomove = true;
    }
    else if (player.sprite.x < this.game.camera.x) {
      game.camera.x -= 1;
      tomove = true;
    }

    if (tomove) {
      var t = this.game.add.tween(this.game.camera).to({x:game.camera.x*game.w, y:game.camera.y*game.h}, speed);
      t.start();
      t.oncomplete.add(function(){this.tweening = false;}, this);
    }
    else {
      this.tweening = false;
    }
  }
};
