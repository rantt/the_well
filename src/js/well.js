/* global Game */
/* global Maze */

//  Lighting effect adapted from http://gamemechanicexplorer.com/#lighting-3 by John Watson (@yafd)
function lineDistance(point1, point2) {
  var x = 0;
  var y = 0;
  x = Math.abs(point1.x - point2.x);
  x *= x;
  y = Math.abs(point1.y - point2.y); 
  y *= y;
  return Math.sqrt(x+y);
}

var wKey;
var aKey;
var sKey;
var dKey;

Game.Well = function(game) {
  this.game = game;
};

Game.Well.prototype = {
  preload: function() {
    this.game.load.image('tiles', 'assets/images/well.png');
    this.game.load.spritesheet('well', 'assets/images/well.png',64,64,16);
    this.game.load.spritesheet('player','assets/images/hero_x64.png',64,64,12);
  },
  create: function() {

    this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics
    
    // The radius of the circle of light
    this.LIGHT_RADIUS = 200;

    //Twice the Size
    var dCols = 42;
    var dRows = 30;
   
    //Generate a new maze 
    var maze = new Maze(dCols, dRows);
    maze.create();

    //Put Player in the first room created
    var startingRoom = maze.nodes[0].room;
    var lastRoom = maze.nodes[maze.nodes.length-1].room;

    this.game.load.tilemap('level', null, maze.drawLevel(), Phaser.Tilemap.CSV );

    this.map = this.game.add.tilemap('level',64,64);
    this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer(0);

    this.map.setCollision(0); //Black Empty Space
    this.map.setCollision(1); //Full Wall
    this.map.setCollision(2); //Half Wall
    this.layer.resizeWorld();

    this.physics.p2.convertTilemap(this.map, this.layer);


    // this.layer.debug = true;

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.cursor = this.game.input.keyboard.createCursorKeys();

    this.player = this.game.add.sprite(startingRoom.center.x*64, startingRoom.center.y*64, 'player');
    this.player.anchor.setTo(0.5,0.5);
    this.game.physics.p2.enable(this.player); // set up player physics
    this.player.body.fixedRotation = true; // no rotation
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    //Create a rectangular hitbox around players body
    this.player.body.clearShapes();
    this.player.body.addRectangle(16,32,0,16);

    this.player.direction = 'down';
    this.player.animations.add('down', [6, 7], 6, true);
    this.player.animations.add('up', [8, 9], 6, true);
    this.player.animations.add('right', [4, 11], 6, true);
    this.player.animations.add('left', [5, 10], 6, true);

    // Create the shadow texture
    this.shadowTexture = this.game.add.bitmapData(this.game.width*4, this.game.height*3);

    // Create an object that will use the bitmap as a texture
    var lightSprite = this.game.add.image(0, 0, this.shadowTexture);

    // Set the blend mode to MULTIPLY. This will darken the colors of
    // everything below this sprite.
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    this.stairs = this.game.add.sprite(lastRoom.center.x*64, lastRoom.center.y*64,'well',9);
    this.game.physics.p2.enable(this.stairs);
    this.stairs.body.fixedRotation= true;
    this.stairs.body.kinematic = true; //immovable

  },
  update: function() {
    if (lineDistance(this.player, this.stairs) < 64){
      this.game.state.start('Darkness'); 
    }

    this.updatePlayerMovements();
    this.updateShadowTexture();
  },
  updateShadowTexture: function() {
    // This function updates the shadow texture (this.shadowTexture).
    // First, it fills the entire texture with a dark shadow color.
    // Then it draws a white circle centered on the pointer position.
    // Because the texture is drawn to the screen using the MULTIPLY
    // blend mode, the dark areas of the texture make all of the colors
    // underneath it darker, while the white area is unaffected.

    // Draw shadow
    // this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
    // this.shadowTexture.context.fillStyle = 'rgb(50, 50, 50)'; //darker
    this.shadowTexture.context.fillStyle = 'rgb(0, 0, 100)'; //dark blue
    // this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)'; //pitch black

    this.shadowTexture.context.fillRect(0, 0, this.game.width*4, this.game.height*3);

    var radius = this.LIGHT_RADIUS + this.game.rnd.integerInRange(1,10);


    //Center Light Around Player
    var gradient =
        this.shadowTexture.context.createRadialGradient(
            this.player.body.x, this.player.body.y,this.LIGHT_RADIUS * 0.75,
            this.player.body.x, this.player.body.y, radius);

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = gradient;
    this.shadowTexture.context.arc(this.player.body.x, this.player.body.y, radius, 0, Math.PI*2);
    this.shadowTexture.context.fill();

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;

  },
  updatePlayerMovements: function() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    var speed = 275;

    if (!this.player.alive){
      return;
    }


    if (this.tweening) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
    }else{
      if (this.cursor.left.isDown || aKey.isDown) {
        this.player.body.velocity.x = -speed;
        this.player.direction = 'left';
        this.player.animations.play('left');
      }
      else if (this.cursor.right.isDown || dKey.isDown) {
        this.player.body.velocity.x = speed;
        this.player.direction = 'right';
        this.player.animations.play('right');
      }
      else if (this.cursor.up.isDown || wKey.isDown) {
        this.player.body.velocity.y = -speed;
        this.player.direction = 'up';
        this.player.animations.play('up');
      }
      else if (this.cursor.down.isDown || sKey.isDown) {
        this.player.body.velocity.y = speed;
        this.player.direction = 'down';
        this.player.animations.play('down');
      }
      else {
        if (this.player.direction === 'up') {
          this.player.frame = 1;
        }
        else if (this.player.direction === 'down') {
          this.player.frame = 0;
        }
        else if (this.player.direction === 'right') {
          this.player.frame = 2;
        }
        else if (this.player.direction === 'left') {
          this.player.frame = 3;
        }
        this.player.animations.stop();
      }
    } 
  },
};
