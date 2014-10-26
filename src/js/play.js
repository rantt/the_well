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
    this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('town');
    this.map.addTilesetImage('RPGTown');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();
    this.layer2 = this.map.createLayer('layer2');
    this.layer2.resizeWorld();


    //Debug
    // this.layer1.debug = true;
    // this.layer2.debug = true;


    // Gray Brick
    this.map.setCollision([13,14,15]);

    // Trees
    this.map.setCollision([16,17,18],true,'layer2');
    
    this.map.setCollision(21);
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


    // Load NPCs 
    this.npcs = this.game.add.group();
    this.map.createFromObjects('objects', 52, 'npcs', 15, true, false, this.npcs)
    
    this.npcs.forEach(function(npc) {
      this.game.physics.p2.enable(npc);
      npc.body.kinematic = true; //immovable

    }, this);  

    this.physics.p2.convertTilemap(this.map, this.layer1);
    this.physics.p2.convertTilemap(this.map, this.layer2);


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

  },

  conversation: function(npc) {
    if (spaceKey.isDown && dialogue.hidden) {
        dialogue.show(npc.script.split('*'));
    }
  },

  update: function() {

    if (spaceKey.isDown && dialogue.hidden) {
      this.npcs.forEach(function(npc) {
        // console.log(npc.x);
         // if (this.game.physics.arcade.distanceBetween(npc,player.sprite) < 200) {
         // console.log('x'+ npc.x + 'y' + npc.y);
         console.log('dist'+parseInt(Math.abs(player.sprite.x - npc.x)+Math.abs(player.sprite.y - npc.y)));
         console.log('distx'+ lineDistance(player.sprite,npc));
         // if (parseInt(Math.abs(player.sprite.x - npc.x)+Math.abs(player.sprite.y - npc.y)) < 100) {
         if (lineDistance(player.sprite, npc) < 100){
          console.log(npc.script);
          dialogue.show(npc.script.split('*'));
        }
      },this);

    }
    function lineDistance(point1, point2) {
      var x = 0;
      var y = 0;
      x = Math.abs(point1.x - point2.x);
      x *= x;
      y = Math.abs(point1.y - point2.y); 
      y *= y;
      return Math.sqrt(x+y);
    }      


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
    var toMove = false;

    if (player.sprite.y > this.game.camera.y + Game.h) {
      Game.camera.y += 1;
      toMove = true;
    }
    else if (player.sprite.y < this.game.camera.y) {
      Game.camera.y -= 1;
      toMove = true;
    }
    else if (player.sprite.x > this.game.camera.x + Game.w) {
      Game.camera.x += 1;
      toMove = true;
    }
    else if (player.sprite.x < this.game.camera.x) {
      Game.camera.x -= 1;
      toMove = true;
    }

    if (toMove) {
      var t = this.game.add.tween(this.game.camera).to({x:Game.camera.x*Game.w, y:Game.camera.y*Game.h}, speed);
      t.start();
      t.onComplete.add(function(){this.tweening = false;}, this);
    }
    else {
      this.tweening = false;
    }
  },
  render: function() {
    // player.sprite.body.debug = true;
  }

};
