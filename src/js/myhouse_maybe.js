/*global Game*/
/*global player*/
/*global Npc*/
/*global tileSize*/
/*global spaceKey*/
/*global dialogue*/

// var musicOn = true;

Game.MyHouseMaybe = function(game) {
  this.game = game;
};

Game.MyHouseMaybe.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics
    Game.music.stop();

    //Get Locally Stored vars
    this.scene = parseInt(localStorage.getItem('scene'));
    this.haveRope = JSON.parse(localStorage.getItem('haveRope')); 
    this.haveLamp = JSON.parse(localStorage.getItem('haveLamp')); 

    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    Game.camera = {x:0, y:1};
    this.game.camera.x = Game.camera.x*Game.w; 
    this.game.camera.y = Game.camera.y*Game.h;

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('myhouse');
    this.map.addTilesetImage('house');
    this.map.addTilesetImage('furniture');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();
    this.layer2 = this.map.createLayer('layer2');
    this.layer2.resizeWorld();

    //Debug
    // this.layer1.debug = true;
    // this.layer2.debug = true;


    this.map.setCollision(2); //empty space
    this.map.setCollision(12); //wall lower
    this.map.setCollision(13); //wall upper
    

    this.map.setCollision(38, true, 'layer2'); //table upper left
    this.map.setCollision(39, true, 'layer2'); //table upper right
    this.map.setCollision(40, true, 'layer2'); //table lower left
    this.map.setCollision(41, true, 'layer2'); //table lower right
    this.map.setCollision(42, true, 'layer2'); //table mid left
    this.map.setCollision(43, true, 'layer2'); //table mid right

    this.map.setCollision(27, true, 'layer2'); //end table
    
    // Load NPCs 
    this.npcs = this.game.add.group();

    this.lines = {
                   dad: {1: '*Hi, son.*What are you up to?',
                          2: '*Hi, son.*What are you up to?',
                          3: '*Might be a lamp in the kitchen.*You should check the drawers.',
                          4: '*Be careful with that lamp.',
                          7: '*Welcome back son.*Thought we lost you there.'},
                   gramps:  {1: '*Hey kiddo.*What can I do for you.',
                              2: '*You\'re playing with Jack?*Who\'s Jack?',
                              7: '*The fall should\'ve killed you.*There was another body down there.*Been there a while,it broke your fall.*You\'re very lucky.'},
                   mom: {7: '*You\'re okay now honey.'},                     
                   clara: {7: '*Why did you go down there?*Because of your imaginary friend?*He told you to, didn\'t he.'},
                 };

    this.npcs.add(new Npc(this.game,tileSize*4-16, tileSize*3,'dad', 9, this.lines.dad[this.scene] )); 
    this.npcs.add(new Npc(this.game,tileSize*3, tileSize*5,'mom', 3, this.lines.mom[this.scene] )); 
    this.npcs.add(new Npc(this.game,tileSize*5-16, tileSize*15-16,'gramps', 9, this.lines.gramps[this.scene] )); 
    this.npcs.add(new Npc(this.game,tileSize*2+16, tileSize*15-16,'clara', 6, this.lines.clara[this.scene] )); 

    this.physics.p2.convertTilemap(this.map, this.layer1);
    this.physics.p2.convertTilemap(this.map, this.layer2);

    this.exitPoints = this.game.add.group();
    this.map.createFromObjects('objects', 4, 'house',3, true, false, this.exitPoints);

    // Initial Player Position by tile
    player.tilex = 3;
    player.tiley = 2; 
    player.create();

    Game.lastLocation = 'MyHouseMaybe';

    dialogue.create();

  },

  update: function() {

    this.exitPoints.forEach(function(ep) {
      var b1 = ep.getBounds();
      var bp = player.sprite.getBounds();
      if (Phaser.Rectangle.intersects(b1,bp)) {
        this.game.state.start('Darkness');
        // this.game.state.start(ep.destination);
      }
    }, this);

    if (spaceKey.isDown && dialogue.hidden) {
      this.npcs.forEach(function(npc) {
        npc.interact();
      },this);
    }


    if (spaceKey.isDown && !dialogue.typing && !dialogue.hidden) {
      dialogue.hide();
    }

    player.update();

  
  },
  // render: function() {
    // player.sprite.body.debug = true;
  // }

};
