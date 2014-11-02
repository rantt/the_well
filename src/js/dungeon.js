/* global Game */
// Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var map = [];
var rooms = [];
var dWall = 0;
var dFloor = 3;
var map = [];

var dRows = 38;
var dCols = 50;

// var dRows = 76;
// var dCols = 100;

// var dRows = 152;
// var dCols = 200;

//Initialize Map
for (var i = 0; i < dRows; i++) {
  map[i] = [];
  for (var j = 0; j < dCols; j++) {
    map[i][j] = 1;
  }
}


Room = function(x, y, width, height) {
  console.log('room',x,y,width,height);
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.top = this.y;
  this.bottom = this.y + this.height - 1; 
  this.left = this.x;
  this.right = this.x + this.width - 1;
  // this.center = {x: Math.round((this.x + this.width / 2)-1), y: Math.round((this.y + this.height / 2)-1)};
  this.center = {x: ~~(this.x + this.width / 2), y: ~~(this.y + this.height / 2)};

  this.topLeft = {x: this.top, y: this.left};
  this.topCenter = {x: this.center.x, y: this.top};
  this.topRight = {x: this.right, y: this.top};

  this.leftCenter = {x: this.left, y: this.center.y};
  this.rightCenter = {x: this.right, y: this.center.y};

  this.bottomLeft = {x: this.x, y: this.bottom};
  this.bottomCenter = {x: this.center.x, y: this.bottom};
  this.bottomRight = {x: this.right, y: this.bottom};
};

Room.prototype = {
  draw: function() {
    for(var i = this.y; i < this.y + this.height; i++) {
      for (var j = this.x; j < this.x + this.width; j++) {
        // console.log(i + " : " + j);
        map[i][j] = dFloor;
      }
    }
  }
}

Node = function(x, y, width, height) {
  this.minLeafSize = 6;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.leftChild = null;
  this.rightChild = null;
  this.room = null;

};

Node.prototype = {
  split: function() {

   if (this.leftChild != null || this.rightChild != null) {
     return false; //bail we already split
   }

   var splitH = rand(1,10) > 5;
   

   if (this.width > this.height && this.height / this.width > 0.5) 
     splitH = false;
   else if (this.height > this.width && this.width / this.height >= 0.05)
     splitH = true;



   var max = ((splitH) ? this.height : this.width) - this.minLeafSize;

   if (max <= this.minLeafSize) 
     return false;  //the area is too small to split

    var split = rand(this.minLeafSize, max);
  
    if (splitH){
      this.leftChild = new Node(this.x, this.y, this.width, split);
      this.rightChild = new Node(this.x, this.y + split, this.width, this.height - split);
    }else{
      this.leftChild = new Node(this.x, this.y, split, this.height);
      this.rightChild = new Node(this.x + split, this.y, this.width - split, this.height);
    }
    return true;

  },
  createRooms: function() {
    if (this.leftChild != null || this.rightChild != null) {
      if (this.leftChild != null) {
        this.leftChild.createRooms();
      }
      if (this.rightChild != null) {
        this.rightChild.createRooms();
      }
      if (this.leftChild != null && this.rightChild != null){
        // Generate Hallways
        var halls = this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
        for (var i = 0; i < halls.length;i++){
          map[halls[i].y][halls[i].x] = dFloor;
        }

      } 
    }else{
      roomWidth = rand(3,this.width); 
      roomHeight = rand(3, this.height);
      //+1 and -1 keep the rooms 1 block away from edges and borders
      roomX = rand(this.x+1, this.x + this.width - roomWidth - 1);
      roomY = rand(this.y+1, this.y + this.height - roomHeight - 1);
      
      // this.room = new Room(this.x, this.y, roomWidth, roomHeight); 
      this.room = new Room(roomX, roomY, roomWidth, roomHeight); 

      this.room.draw(); 
    }
  },
  createHall: function(lRoom, rRoom) {
    var halls = [];
    var sidestepChance = 10;

    pointA = {x: ~~(Math.random() * lRoom.width) + lRoom.x, y:  ~~(Math.random() * lRoom.height) + lRoom.y};
    pointB = {x: ~~(Math.random() * rRoom.width) + rRoom.x, y:  ~~(Math.random() * rRoom.height) + rRoom.y};

    while (pointB.x !== pointA.x || pointB.y !== pointA.y) {
      var num = Math.random()*100;

      if (num < sidestepChance) {
        if (pointB.x !== pointA.x) {
          if(pointB.x > pointA.x) {
            pointB.x--;
          }else {
            pointB.x++;
          }
        }
      }else if(pointB.y !== pointA.y) {
        if(pointB.y > pointA.y) {
          pointB.y--;
        }else {
          pointB.y++;
        }
      }

      // if(pointB.x < dCols && pointB.y < dRows) {
      if(pointB.x < dCols && pointB.y < dRows) {
       halls.push({x:pointB.x, y:pointB.y});
       // halls[halls.length] = {x:pointB.x, y:pointB.y};
      } 

    }
    return halls;

    
  },
  getRoom: function() {
    if (this.room != null) {
      return this.room;
    }else {
      var lRoom;
      var rRoom;
      if (this.leftChild != null) {
        lRoom = this.leftChild.getRoom();
      }
      if (this.rightChild != null) {
        rRoom = this.rightChild.getRoom();
      }
      if (lRoom == null && rRoom == null){
        return null;
      }else if (rRoom == null) {
        return lRoom;
      }else if (lRoom == null) {
        return rRoom;
      }else if (Math.random() > 0.5) {
        return lRoom;
      }else {
        return rRoom;
      }
    }
  } 
};

Dungeon = function(game, dCols, dRows) {
  this.game = game;
  this.dRows = dRows;
  this.dCols = dCols;
  this.roomMin = 3;
  this.roomMax = 9;
  this.tileSize = 32;
  // this.map = [];
};

Dungeon.prototype = {
  create: function() {
    this.root = new Node(0,0,dCols,dRows);

    this.nodes = this.traverse(this.root, []);
    this.root.createRooms();

  },
  traverse: function(root, nodes) {
    // var maxLeafSize = 20;
    // var maxLeafSize = 10;
    var maxLeafSize = 0;
    var nodes = nodes;
    if (root.leftChild == null && root.rightChild == null) {
     if (root.width > maxLeafSize || root.height > maxLeafSize) {
       if (root.split()) {
         return this.traverse(root.leftChild, nodes) && this.traverse(root.rightChild, nodes);
       }
     }
    }
    // root.createRooms();
    nodes.push(root);
    return nodes;      
  },
  drawLevel: function() {
    var line;
    result = ""; 



    for (var i = 0; i < dRows; i++) {
      line = [];
      for (var j = 0; j < dCols; j++) {
        line[j] = map[i][j];
      }
      result += line.join(',') + "\n";
    }
    return result;
  },
};
