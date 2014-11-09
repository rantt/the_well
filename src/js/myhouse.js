/*global Game*/
/*global player*/
/*global Npc*/

// var musicOn = true;

var spaceKey;

Game.MyHouse = function(game) {
  this.game = game;
};

Game.MyHouse.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics


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


    // Gray Brick
    // this.map.setCollision([13,14,15]);

    // Trees
    // this.map.setCollision([16,17,18],true,'layer2');
    
    this.map.setCollision(2); //empty space
    this.map.setCollision(8); //blue wall upper
    this.map.setCollision(9); //blue wall lower
    this.map.setCollision(31); //window

    this.map.setCollision(36,true,'layer2'); //chair right
    this.map.setCollision(37,true,'layer2'); //chair left

    this.map.setCollision(38,true,'layer2'); //chair left
    this.map.setCollision(39,true,'layer2'); //chair left
    this.map.setCollision(40,true,'layer2'); //chair left
    this.map.setCollision(41,true,'layer2'); //chair left
    this.map.setCollision(42,true,'layer2'); //chair left
    this.map.setCollision(43,true,'layer2'); //chair left


    this.map.setCollision(27,true,'layer2'); //slim dresser
    this.map.setCollision(32,true,'layer2'); //wide dresser

    // TODO: Roof tiles should overlap sprite
    // Roof 
    // this.map.setCollision(25);
    // this.map.setCollision(26);
    // this.map.setCollision(27);
    // this.map.setCollision(32);
    // this.map.setCollision(52);

    // this.map.setCollision(28);
     
    // Signs
    // this.map.setCollision(33,true,'layer2');


    // Load NPCs 
    this.npcs = this.game.add.group();
    this.map.createFromObjects('objects', 54, 'dad', 3, true, false, this.npcs, Npc);

    this.physics.p2.convertTilemap(this.map, this.layer1);
    this.physics.p2.convertTilemap(this.map, this.layer2);


    this.exitPoints = this.game.add.group();
    this.map.createFromObjects('objects', 4, 'house',3, true, false, this.exitPoints);

    // Initial Player Position by tile
    player.tilex = 8;
    player.tiley = 17;
    player.create();
    // player.reposition();
    
    // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    dialogue.create();

    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },

  update: function() {

    this.exitPoints.forEach(function(ep) {
      b1 = ep.getBounds();
      bp = player.sprite.getBounds();
      if (Phaser.Rectangle.intersects(b1,bp)) {
        console.log('you are in a door going to ' + ep.destination);
        this.game.state.start(ep.destination);
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
  render: function() {
    // player.sprite.body.debug = true;
  }

};
