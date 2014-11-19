/*global Game*/
/*global dialogue*/
/*global spaceKey*/

Game.Darkness = function(game) {
  this.game = game;
};

Game.Darkness.prototype = {
  preload: function() {
    this.game.stage.backgroundColor = '#000';
  },
  create: function() {

    Game.camera = {x:0, y:0};

  
    //Get Locally Stored vars
    this.scene = parseInt(localStorage.getItem('scene'));
    this.haveRope = JSON.parse(localStorage.getItem('haveRope')); 

    if (this.scene < 6) {
      this.jack = this.game.add.sprite(Game.w/2-32, Game.h/2-32, 'jack');
      this.jack.frame = 12;

      Game.music.stop();
      Game.music = this.game.add.sound('tomb');
      Game.music.volume = 0.5;
      Game.music.play('',0,1,true);
    }
  this.haveLamp = JSON.parse(localStorage.getItem('haveLamp')); 

    
    dialogue.create();

    dialogue.hidden = true;

    this.restartText = this.game.add.bitmapText(Game.w/2, Game.h/2-200, 'minecraftia','',21);
    this.restartText.x = this.game.width / 2 - this.restartText.textWidth / 2 - 175;
  },
  update: function() {

    switch(this.scene) {
      case 4:
        if (dialogue.hidden) {
          dialogue.show(this,['','...','Wake up!','It\'s time to play.','Get to the stairs, if you can.']); 
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
          dialogue.show(this,['','Wake up!','Wake up son! Wake up!']); 
        }

        if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
          this.scene = 7;
          localStorage.setItem('scene', '7'); 
          dialogue.hide();
          dialogue.hidden = true;
          this.game.state.start('MyHouseMaybe');
        }
        break;
      case 7:
        if (dialogue.hidden) {
          dialogue.show(this,['','There\'s no way out.','Not really...','THE END.']); 
        }

        if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
          var msg =  'You survived... or did you?' + '\n';
          msg += '~Share on twitter!~\n';
          this.restartText.setText(msg);
          this.restartText.visible = true;

          this.twitterButton = this.game.add.button(Game.w/2, Game.h/2-100,'twitter', this.twitter, this);
          this.twitterButton.anchor.setTo(0.5,0.5);
          this.twitterButton.fixedToCamera = true;

          //Reset the World
          localStorage.setItem('scene', '1'); 
          localStorage.setItem('haveLamp', false); 
          localStorage.setItem('haveRope', false); 
        }

    }

  },
  twitter: function() {
    window.open('http://twitter.com/share?text=I+escaped+The+Well!+See+if+you+can+make+it+out+at&via=rantt_&url=http://www.divideby5.com/games/the_well/', '_blank');
  },
};
