/*global Game*/
/*global player*/
/*global Npc*/

// var musicOn = true;

var spaceKey;

Game.Gramps = function(game) {
  this.game = game;
};

Game.Gramps.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics

    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    Game.camera = {x:0, y:1};
    this.game.camera.x = Game.camera.x*Game.w; 
    this.game.camera.y = Game.camera.y*Game.h;

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('gramps');
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


    //Walls
    this.map.setCollision(16); //wall lower
    this.map.setCollision(17); //wall upper
    this.map.setCollision(6); //wall lower
    this.map.setCollision(7); //wall upper

    this.map.setCollision(38, true, 'layer2'); //table upper left
    this.map.setCollision(39, true, 'layer2'); //table upper right
    this.map.setCollision(40, true, 'layer2'); //table lower left
    this.map.setCollision(41, true, 'layer2'); //table lower right
    this.map.setCollision(42, true, 'layer2'); //table mid left
    this.map.setCollision(43, true, 'layer2'); //table mid right

    //Cabinets

    this.map.setCollision(27, true, 'layer2'); //end table
    this.map.setCollision(29, true, 'layer2'); //sink
    this.map.setCollision(30, true, 'layer2'); //window
    this.map.setCollision(31, true, 'layer2'); //end table
    this.map.setCollision(32, true, 'layer2'); //end table
    

    // Load NPCs 
    this.npcs = this.game.add.group();

    if (Game.scene === 3) {
      if (Game.haveRope === false) {
        this.npcs.add(new Npc(this.game,tileSize*2+16, tileSize*15-16,'gramps', 0, '*Hey Kiddo.*Oh, I might have some rope.*Check the closet by the bedroom.' )); 
        this.npcs.add(new Npc(this.game,tileSize*2,tileSize*3,'furniture',4,'*You take the rope.',false));
      }else {
        this.npcs.add(new Npc(this.game,tileSize*2+16, tileSize*15-16,'gramps', 0, '*Hey Kiddo.*Oh, I might have some rope.*Check the closet by the bedroom.' )); 
        this.npcs.add(new Npc(this.game,tileSize*2,tileSize*3,'furniture',4,'*You already have the rope.',false));
      }
    }

    this.physics.p2.convertTilemap(this.map, this.layer1);
    this.physics.p2.convertTilemap(this.map, this.layer2);


    this.exitPoints = this.game.add.group();
    this.map.createFromObjects('objects', 11, 'house', 10, true, false, this.exitPoints);

    // Initial Player Position by tile
    player.tilex = 6;
    player.tiley = 17
    player.create();
    Game.lastLocation = "Gramps";

    dialogue.create();

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
        if ((npc.key === 'furniture') && (Game.haveRope === false)) {
          Game.haveRope = true;
          npc.interact();
          npc.script = ['','You already have the rope.'];
        }else {
          npc.interact();
        }
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
