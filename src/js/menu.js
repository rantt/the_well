/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {

        this.title = this.game.add.sprite(Game.w/2,Game.h/2,'title');
        console.log(Game.w/2+' '+Game.h/2);
        this.title.anchor.setTo(0.5,0.5);

        // this.instructions = this.game.add.sprite(Game.w/2,200,'instructions');
        // this.instructions.scale.x = 0.5;
        // this.instructions.scale.y = 0.5;

        // Start Message
        // var loadingText = this.game.add.bitmapText(Game.w, Game.h, 'minecraftia', '=click to start=', 30);
    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        // this.game.state.start('Town');
        this.game.state.start('Well');
      }
    }
};
