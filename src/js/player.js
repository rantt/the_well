/*global Game*/
/*global tileSize*/
/*global dialogue*/

var wKey;
var aKey;
var sKey;
var dKey;

var Player = function(game) {
  this.game = game;
  this.sprite = null;
  this.alive = true;
  this.tilex = 0;
  this.tiley = 0;
};

Player.prototype = {
  preload: function() {
    this.game.load.spritesheet('player','assets/images/hero_x64.png',64,64,12);
  },
  create: function() {
    this.cursor = this.game.input.keyboard.createCursorKeys();

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    this.sprite = this.game.add.sprite(this.tilex*tileSize-tileSize/2,this.tiley*tileSize+tileSize/2,'player');
    
    this.sprite.anchor.setTo(0.5,0.5);
    this.game.physics.p2.enable(this.sprite); // set up player physics
    this.sprite.body.fixedRotation = true; // no rotation

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

    this.movements();
    this.updatecamera();

  },
  updatecamera: function() {
    if (this.tweening) {
      return;
    }
    this.tweening = true;
    
    var speed = 700;
    var toMove = false;

    if (this.sprite.y > this.game.camera.y + Game.h) {
      Game.camera.y += 1;
      toMove = true;
    }
    else if (this.sprite.y < this.game.camera.y) {
      Game.camera.y -= 1;
      toMove = true;
    }
    else if (this.sprite.x > this.game.camera.x + Game.w) {
      Game.camera.x += 1;
      toMove = true;
    }
    else if (this.sprite.x < this.game.camera.x) {
      Game.camera.x -= 1;
      toMove = true;
    }

    if (toMove) {
      var t = this.game.add.tween(this.game.camera).to({x:Game.camera.x*Game.w, y:Game.camera.y*Game.h}, speed);
      t.start();
      t.onComplete.add(function(){this.tweening = false;}, this);
    }
    else {
      this.tweening = false;
    }
  },
  reposition: function() {
    this.sprite.x = this.tilex*tileSize-tileSize/2;
    this.sprite.y = this.tiley*tileSize+tileSize/2;
  },
  movements:  function() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    var speed = 275;

    if (this.tweening) {
      //Don't move while camera is panning
      this.sprite.body.velocity.x = 0;
      this.sprite.body.velocity.y = 0;
    }else{
      //Don't move when the dialogue box is visible
      if ((dialogue.hidden) && (this.cursor.left.isDown || aKey.isDown)) {
        this.sprite.body.velocity.x = -speed;
        this.sprite.direction = 'left';
        this.sprite.animations.play('left');
      }
      else if ((dialogue.hidden) && (this.cursor.right.isDown || dKey.isDown)) {
        this.sprite.body.velocity.x = speed;
        this.sprite.direction = 'right';
        this.sprite.animations.play('right');
      }
      else if ((dialogue.hidden) && (this.cursor.up.isDown || wKey.isDown)) {
        this.sprite.body.velocity.y = -speed;
        this.sprite.direction = 'up';
        this.sprite.animations.play('up');
      }
      else if ((dialogue.hidden) && (this.cursor.down.isDown || sKey.isDown)) {
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
};

