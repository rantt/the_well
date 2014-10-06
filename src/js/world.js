/* global Game*/

Game.World = function(game) {
  this.game = game;
};

Game.World.prototype = {
  preload: function() {
    this.game.load.tilemap('test3','assets/maps/test3.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('RPG', 'assets/images/RPG.png', 32, 32);
  },
  create: function() {

  },
};
