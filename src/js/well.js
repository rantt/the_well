/* global Game */
/* global Dungeon */
/* global player */
/* global tileSize */
var wKey;
var aKey;
var sKey;
var dKey;

Game.Well = function(game) {
  this.game = game;
};

Game.Well.prototype = {
  preload: function() {
    // this.game.load.image('tiles', 'assets/images/dungeon2_sheet.png');
    this.game.load.image('tiles', 'assets/images/well.png');
    this.game.load.spritesheet('player','assets/images/hero_x64.png',64,64,12);
  },
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics
    this.game.world.setBounds(0, 0, Game.w, Game.h);
    // dungeon = new Dungeon(game, dCols, dRows);
    
    //Twice the Size
    dCols = 42;
    dRows = 30;

    //4 Times Scale
    // dCols = 56;
    // dRows = 40;
    console.log('Well',dCols, dRows);
    dungeon = new Dungeon(game, dCols, dRows);
    dungeon.create();
    // console.log(dungeon.nodes);
    starting_room = dungeon.nodes[0].room;
    console.log('sr',starting_room);
    console.log(starting_room);
    this.game.load.tilemap('level', null, dungeon.drawLevel(), Phaser.Tilemap.CSV );
    console.log(dungeon.drawLevel());

    this.map = this.game.add.tilemap('level',64,64);
    this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer(0);
    // this.layer.debug = true;
    this.map.setCollision(0);
    this.map.setCollision(1);
    this.map.setCollision(2);
    this.layer.resizeWorld();

    this.physics.p2.convertTilemap(this.map, this.layer);

    // player.create();
    // player.sprite.x = starting_room.center.x;
    // player.sprite.y = starting_room.center.y;
    // console.log(player.sprite.x, player.sprite.y);
    this.layer.debug = true;

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.cursor = this.game.input.keyboard.createCursorKeys();

    // this.sprite = this.game.add.sprite(this.tilex*tileSize-tileSize/2,this.tiley*tileSize+tileSize/2,'player');
    
    this.sprite = this.game.add.sprite(starting_room.center.x*64, starting_room.center.y*64, 'player');
    this.sprite.anchor.setTo(0.5,0.5);
    this.game.physics.p2.enable(this.sprite); // set up player physics
    this.sprite.body.fixedRotation = true; // no rotation
    // this.game.camera.follow(this.sprite);
    this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);

    //Create a rectangular hitbox around players body
    this.sprite.body.clearShapes();
    this.sprite.body.addRectangle(16,32,0,16);

    this.sprite.direction = 'down';
    this.sprite.animations.add('down', [6, 7], 6, true);
    this.sprite.animations.add('up', [8, 9], 6, true);
    this.sprite.animations.add('right', [4, 11], 6, true);
    this.sprite.animations.add('left', [5, 10], 6, true);

  },
  update: function() {
    // console.log(player.sprite.x);
    // player.update();
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    if (!this.sprite.alive){
      return;
    }

    var speed = 275;

    if (this.tweening) {
      this.sprite.body.velocity.x = 0;
      this.sprite.body.velocity.y = 0;
    }else{
      if (this.cursor.left.isDown || aKey.isDown) {
        this.sprite.body.velocity.x = -speed;
        this.sprite.direction = 'left';
        this.sprite.animations.play('left');
      }
      else if (this.cursor.right.isDown || dKey.isDown) {
        this.sprite.body.velocity.x = speed;
        this.sprite.direction = 'right';
        this.sprite.animations.play('right');
      }
      else if (this.cursor.up.isDown || wKey.isDown) {
        this.sprite.body.velocity.y = -speed;
        this.sprite.direction = 'up';
        this.sprite.animations.play('up');
      }
      else if (this.cursor.down.isDown || sKey.isDown) {
        this.sprite.body.velocity.y = speed;
        this.sprite.direction = 'down';
        this.sprite.animations.play('down');
      }
      else {
        if (this.sprite.direction === 'up') {
          this.sprite.frame = 1;
        }
        else if (this.sprite.direction === 'down') {
          this.sprite.frame = 0;
        }
        else if (this.sprite.direction === 'right') {
          this.sprite.frame = 2;
        }
        else if (this.sprite.direction === 'left') {
          this.sprite.frame = 3;
        }
        this.sprite.animations.stop();
      }
    } 

  },
  render: function() {
    this.game.debug.text('worldx: '+ this.game.world.x+' worldy: '+this.game.world.y, 64, 64);
  },    
};
