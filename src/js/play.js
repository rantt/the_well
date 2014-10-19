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

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

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

    // Initial Player Position by tile
    player.tilex = 12;
    player.tiley = 7;

    player.create();
    // Music
    this.music = this.game.add.sound('music');
    this.music.volume = 0.5;
    this.music.play('',0,1,true);

    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

  },
  update: function() {
    this.game.physics.arcade.collide(player.sprite, this.layer1);
    this.game.physics.arcade.collide(player.sprite, this.layer2);

    player.update();
   
  },
   

};
