/*global Game*/

function lineDistance(point1, point2) {
  var x = 0;
  var y = 0;
  x = Math.abs(point1.x - point2.x);
  x *= x;
  y = Math.abs(point1.y - point2.y); 
  y *= y;
  return Math.sqrt(x+y);
}

var Npc = function(game,x,y,name,startFrame) {
  Phaser.Sprite.call(this, game, x+32, y-32 , name, startFrame);
  this.game.physics.p2.enable(this);
  this.body.kinematic = true; //immovable

  //Set Frames for facing
  this.LEFT = 9;
  this.RIGHT = 6;
  this.UP = 3;
  this.DOWN = 0;

};

Npc.prototype = Object.create(Phaser.Sprite.prototype);
Npc.prototype.interact = function() {
         if (lineDistance(player.sprite, this) < 64){
           yDiff = this.y - player.sprite.y;
           xDiff = this.x - player.sprite.x;

           //Face the player
           if (Math.abs(xDiff) > Math.abs(yDiff)) {
             if (xDiff > 0) {
               this.frame = this.LEFT;
             }else {
               this.frame = this.RIGHT;
             }
           }else {
             if (yDiff > 0) {
               this.frame = this.UP;
             }else {
               this.frame = this.DOWN;
             }

           }


          dialogue.show(this.script.split('*'));
        }

};
Npc.prototype.constructor = Npc;

