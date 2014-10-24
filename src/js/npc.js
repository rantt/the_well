/*global Game*/


Npc = function(game, character, x, y) {
  this.game = game;
  this.sprite = this.game.add.sprite(x, y, 'npcs');

  this.sprite.frame =

  this.facing = 'down';
};

Npc.prototype = {
  create: function() {

  }
};

