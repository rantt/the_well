/*global Player*/
/*global Dialogue*/

var tileSize = 64;
var dRows = 10;
var dCols = 12;

var player;

var Game = {
  w: tileSize*dCols,
  h: tileSize*dRows,
  camera: {x:0,y:0} 
};

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
		this.game.stage.backgroundColor = '#000';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');
    this.game.load.bitmapFont('minecraftia','assets/fonts/font.png','assets/fonts/font.xml');
  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {
    
    //Debug Plugin    
    this.game.add.plugin(Phaser.Plugin.Debug);

    //Loading Screen Message/bar
    // var loadingText = this.game.add.bitmapText(Game.w, Game.h, 'minecraftia', 'Loading...', 21);

  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);

    this.game.load.tilemap('town','assets/maps/town.json',null,Phaser.Tilemap.TILED_JSON);
    this.game.load.image('town','assets/images/town.png',tileSize,tileSize);
    // this.game.load.image('RPGTextbox','assets/images/RPGTextbox_x64.png',tileSize,tileSize);
    this.game.load.image('textbox','assets/images/textbox.png',tileSize,tileSize);
    // this.game.load.spritesheet('npcs', 'assets/images/npcs.png',64,64,20);
    this.game.load.spritesheet('mom','assets/images/npc_mom.png',64,64,12);
  
    dialogue = new Dialogue(this.game);
    dialogue.preload();

    player = new Player(this.game);
    player.preload(); 

    // Music Track
    this.game.load.audio('music','assets/audio/a_theme.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};
