/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {

        this.title = this.game.add.sprite(Game.w/2,Game.h/2-100,'title');
        this.title.anchor.setTo(0.5,0.5);

        this.instructions = this.game.add.sprite(Game.w/2-100,400,'instructions');
        this.instructions.scale.x = 0.5;
        this.instructions.scale.y = 0.5;
    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Town');
        // // Music
        Game.music = this.game.add.sound('music');
        Game.music.volume = 0.5;
        Game.music.play('',0,1,true);
      }
    }
};
