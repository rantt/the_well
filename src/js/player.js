/*global Game*/
/*global tileSize*/

var wKey;
var aKey;
var sKey;
var dKey;

Player = function(game) {
  this.game = game;
  this.sprite = null;
  this.alive = true;
  this.camera = {x:0,y:0};
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

    // this.sprite = this.game.add.sprite(256,256,'player');
    this.sprite = this.game.add.sprite(this.tilex*tileSize-tileSize/2,this.tiley*tileSize+tileSize/2,'player');
    
    console.log('x = '+this.tilex*tileSize);
    console.log('y = '+this.tiley*tileSize);
    this.sprite.anchor.setTo(0.5,0.5);
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    // this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);

    this.sprite.direction = 'down';
    this.sprite.animations.add('down', [6, 7], 6, true);
    this.sprite.animations.add('up', [8, 9], 6, true);
    this.sprite.animations.add('right', [4, 11], 6, true);
    this.sprite.animations.add('left', [5, 10], 6, true);
  },
  update: function() {
    this.movements();
    this.updateCamera();
  },
  updateCamera: function() {
    if (this.tweening) {
      return;
    }
    this.tweening = true;
    
    var speed = 700;
    var toMove = false;

    if (player.sprite.y > this.game.camera.y + Game.h) {
      this.camera.y += 1;
      toMove = true;
    }
    else if (player.sprite.y < this.game.camera.y) {
      this.camera.y -= 1;
      toMove = true;
    }
    else if (player.sprite.x > this.game.camera.x + Game.w) {
      this.camera.x += 1;
      toMove = true;
    }
    else if (player.sprite.x < this.game.camera.x) {
      this.camera.x -= 1;
      toMove = true;
    }

    if (toMove) {
      var t = this.game.add.tween(this.game.camera).to({x:this.camera.x*Game.w, y:this.camera.y*Game.h}, speed);
      t.start();
      t.onComplete.add(function(){this.tweening = false;}, this);
    }
    else {
      this.tweening = false;
    }
 
  },
  movements:  function() {
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
  }
}

