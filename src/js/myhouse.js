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
    
    // this.map.setCollision(21);
    // this.map.setCollision(22);
    // this.map.setCollision(23);
    // this.map.setCollision(24);
    //

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
    // this.map.createFromObjects('objects', 37, 'mom', 1, true, false, this.npcs);
    // this.map.createFromObjects('objects', 52, 'jack', 3, true, false, this.npcs);

    // this.layerobjects_tiles = this.game.physics.p2.convertCollisionObjects(this.map,"objects");
    this.physics.p2.convertTilemap(this.map, this.layer1);
    this.physics.p2.convertTilemap(this.map, this.layer2);


    this.exitPoints = this.game.add.group();
    this.map.createFromObjects('objects', 4, 'house',3, true, false, this.exitPoints);
    //
    // this.npcs.forEach(function(npc) {
    //   this.game.physics.p2.enable(npc);
    //   npc.body.kinematic = true; //immovable
    //
    // }, this);


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

  conversation: function(npc) {
    if (spaceKey.isDown && dialogue.hidden) {
        dialogue.show(npc.script.split('*'));
    }
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
    //
    // if (spaceKey.isDown && dialogue.hidden) {
    //   this.npcs.forEach(function(npc) {
    //      if (lineDistance(player.sprite, npc) < 64){
    //       dialogue.show(npc.script.split('*'));
    //     }
    //   },this);
    //
    // }
    function lineDistance(point1, point2) {
      var x = 0;
      var y = 0;
      x = Math.abs(point1.x - point2.x);
      x *= x;
      y = Math.abs(point1.y - point2.y); 
      y *= y;
      return Math.sqrt(x+y);
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
