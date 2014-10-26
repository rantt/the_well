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

  // this.sprite = this.game.add.sprite(x, y, 'npcs',15);
  // this.game.physics.p2.enable(this.sprite);
  // this.sprite.body.kinematic = true; //immovable
    
  this.facing = 'down';
};

Npc.prototype = {
  create: function() {

  }
};

