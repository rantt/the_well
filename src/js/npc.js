/*global Game*/


Npc = function(game, character, x, y, script) {
  this.game = game;
  this.character = character;
  this.script = script;
  if (this.character === 'mom') {
    this.FRONT = 15;
    this.BACK = 16;
    this.RIGHT = 17;
    this.LEFT = 18; 
  }

  this.sprite = this.game.add.sprite(x, y, 'npcs',this.FRONT);
  this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.enableBody = true;
  this.sprite.immovable = true;    
    
  this.facing = 'down';
};

Npc.prototype = {
  create: function() {

  }
};

