/*global Game*/

// var game = new Phaser.Game(Game.w, Game.h, Phaser.CANVAS, 'game',{ preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(Game.w, Game.h, Phaser.CANVAS, 'game');  // NEED CANVAS FOR DEBUG
// var game = new Phaser.Game(Game.w, Game.h, Phaser.AUTO, 'game');
game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Play', Game.Play);
game.state.add('World', Game.World);

game.state.start('Boot');
