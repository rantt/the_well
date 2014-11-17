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

    //Get Locally Stored vars
    this.scene = parseInt(localStorage.getItem('scene'));
    this.haveRope = JSON.parse(localStorage.getItem('haveRope')); 
    this.haveLamp = JSON.parse(localStorage.getItem('haveLamp')); 
    
    dialogue.create();

    Game.music.stop();
    dialogue.hidden = true;
  },
  update: function() {
    // player.update();
    console.log(this.scene);

    switch(this.scene) {
      case 4:
        if (dialogue.hidden) {
          dialogue.show(this,['','...','Wake up!','It\'s time to play.','Get to the stairs, if you want to go.']); 
        }

        if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
          this.scene = 5;
          localStorage.setItem('scene', '5'); 
          dialogue.hide();
          this.game.state.start('Well');
        }
        break;
      case 5:
        if (dialogue.hidden) {
          console.log('showing dia',this.scene);
          dialogue.show(this,['','Not what you expected right?','You died, you know.','You fell, just like me.','There\'s no way out.  Not really.']); 
        }

        if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
          this.scene = 6;
          localStorage.setItem('scene', '6'); 
          dialogue.hide();
          this.game.state.start('Well');
        }
        break;
      case 6:
        if (dialogue.hidden) {
          console.log('showing dia',this.scene);
          dialogue.show(this,['','Wake up!','Wake up son! Wake up!']); 
        }

        if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
          this.scene = 7;
          localStorage.setItem('scene', '7'); 
          dialogue.hide();
          dialogue.hidden = true;
          this.game.state.start('MyHouse');
        }
    }

  },
}
