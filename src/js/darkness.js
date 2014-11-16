/*global Game*/
/*global player*/
/*global Npc*/

Game.Darkness = function(game) {
  this.game = game;
};

Game.Darkness.prototype = {
  preload: function() {
    this.game.stage.backgroundColor = '#000';
  },
  create: function() {

    Game.camera = {x:0, y:0}
    // player.create();
    dialogue.create();
    // spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    Game.music.stop();
    dialogue.hidden = true;
  },
  update: function() {
    // player.update();
    console.log(Game.scene);
    if (Game.scene === 4) {
      if (dialogue.hidden) {
        dialogue.show(this,['','Wake up!','It\'s time to play.','Find the stairs to escape.']); 
      }

      if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
        Game.scene = 5;
        dialogue.hide();
        this.game.state.start('Well');
      }
    }else if (Game.scene === 5) {
      if (dialogue.hidden) {
        console.log('showing dia',Game.scene);
        dialogue.show(this,['','You died, you know.','You fell, just like me.','Don\'t you want to stay and play?']); 
      }

      if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
        Game.scene = 6;
        dialogue.hide();
        this.game.state.start('Well');
      }
    }else if (Game.scene === 6) {
      if (dialogue.hidden) {
        console.log('showing dia',Game.scene);
        dialogue.show(this,['','Wake up!','Son, please wake up!']); 
      }

      if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
        Game.scene = 7;
        dialogue.hide();
        this.game.state.start('MyHouse');
      }
    }

  },
}
