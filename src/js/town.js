/*global Game*/
/*global player*/
/*global Npc*/

// var musicOn = true;


Game.Town = function(game) {
  this.game = game;
};

Game.Town.prototype = {
  preload: function() {
    this.scene = parseInt(localStorage.getItem('scene'));
    this.haveRope = JSON.parse(localStorage.getItem('haveRope')); 
    this.haveLamp = JSON.parse(localStorage.getItem('haveLamp')); 
    console.log('scene',this.scene);
  },
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('town');
    this.map.addTilesetImage('town');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();
    this.layer2 = this.map.createLayer('layer2');
    this.layer2.resizeWorld();

    //Get Locally Stored vars


    //Debug
    // this.layer1.debug = true;
    // this.layer2.debug = true;

    // Gray Brick
    this.map.setCollision([13,14,15]);

    // Trees
    this.map.setCollision([16,17,18],true,'layer2');
    
    this.map.setCollision(21);
    this.map.setCollision(22);
    this.map.setCollision(23);
    this.map.setCollision(24);

    // Roof 
    this.map.setCollision(25);
    this.map.setCollision(26);
    this.map.setCollision(27);
    this.map.setCollision(32);
    this.map.setCollision(52);

    this.map.setCollision(30);
    this.map.setCollision(34,true,'layer2');
     
    // Signs
    this.map.setCollision(33,true,'layer2');

    // Load NPCs 
    this.npcs = this.game.add.group();

    this.lines = {
                  'mom':  {1: '*Hi honey.*Beautiful day, isn\'t it?',
                           2: '*You wanna play with Jack?*Oh, ok.  Have fun.*Be home for dinner.',
                           3: '*There might be some in the house.*Why don\'t you ask your father.',
                           4: '*There might be some in the house.*Why don\'t you ask your father.'},
                  'jack': {1: '*Hey, wanna play?*Let\'s go to the old well.*Better ask your mom first.',
                           2: '*We should go down there.*We\'ll need some stuff though.*Go get some rope and a light.',
                           3: '*We should go down there?*We\'ll need some stuff though.*Go get some rope and a light.',
                           4: '*Oh, good you got everything!*What are we waiting for?, Let\'s go!',
                           7: '*Well, I guess this is it.'},
                  'clara': {1: '*Hi, nice day for skipping!',
                            2: '*Hey, wanna play?*Jack huh? You always play with him.*Nevermind then!',
                            3: '*Rope?*I have skipping rope. Will that work?',
                            4: '*Rope?*I have skipping rope. Will that work?'}
                } 


    this.physics.p2.convertTilemap(this.map, this.layer1);
    this.physics.p2.convertTilemap(this.map, this.layer2);

    //Add Mom
    if ((this.haveRope) && (this.haveLamp) && (this.scene !== 7)) {
      this.scene = 4;
      localStorage.setItem('scene', '4'); 
    }
    
    
    //Add Jack
    if ((this.scene === 1) || (this.scene === 7)) {
      this.jack = new Npc(this.game,tileSize*10, tileSize*7,'jack', 9, this.lines['jack'][this.scene]);
    }else {
      this.jack = new Npc(this.game,tileSize*5, tileSize*15,'jack', 9, this.lines['jack'][this.scene]);
    }

    if (this.scene !== 7 ) {
      this.npcs.add(new Npc(this.game,tileSize*9, tileSize*3,'mom', 0, this.lines['mom'][this.scene] )); 

      //Add Clara
      this.clara = new Npc(this.game,tileSize*16, tileSize*6,'clara', 0, this.lines['clara'][this.scene]);
      this.clara.animations.add('skipping',[12,13,14],6,true);        
      this.clara.animations.play('skipping');

      // Add NPCs to group
      this.npcs.add(this.clara); 
    }

    this.jack.animations.add('right', [7,8],6,true);
    this.npcs.add(this.jack); 

    this.exitPoints = this.game.add.group();
    this.map.createFromObjects('objects', 29, 'town', 28, true, false, this.exitPoints);
    this.map.createFromObjects('objects', 30, 'town', 29, true, false, this.exitPoints);
    this.map.createFromObjects('objects', 34, 'town', 33, true, false, this.exitPoints);


    // Initial Player Position by tile
    if (Game.lastLocation == "MyHouse") {
      Game.camera = {x:0, y:0}
      player.tilex = 5;
      player.tiley = 6;
      Game.lastLocation = "Town";
    }else if (Game.lastLocation == "Gramps") {
      //Move to house without tweening
      Game.camera = {x:1, y:1}
      this.game.camera.x = Game.camera.x*Game.w;
      this.game.camera.y = Game.camera.y*Game.h;

      player.tilex = 20;
      player.tiley = 17;
      Game.lastLocation = "Town";
    }

    player.create();
    dialogue.create();


  },
  updateCharacterLines: function() {
    if (this.updating) {
      return;
    }
    this.updating = true;
    this.npcs.forEach(function(npc) {
      npc.script = this.lines[npc.key][this.scene].split('*');
      npc.spoke = false;
    },this);
    this.updating = false;
  },
  jackLeaves: function() {
    //Jack Walks off and goes to the well
    if (this.tweening) {
      return;
    }
    this.tweening = true;
    this.jack.animations.play('right');
    var t = this.game.add.tween(this.jack.body).to({x: this.jack.body.x+256}, 1000);
    t.start();
    t.onComplete.add(function() {
      this.scene = 2;
      localStorage.setItem('scene', '2'); 
      this.tweening = false;
      this.jack.body.x = tileSize*5-32; 
      this.jack.body.y = tileSize*15-32; 
      this.jack.frame = 9;
      this.jack.animations.stop();
      this.updateCharacterLines();
    }, this);
  },
  update: function() {

    if (this.scene !== 7) {
      if (dialogue.speaker === this.clara) {
        this.clara.animations.stop();
      }else {
        if (this.clara.animations.currentAnim != 'skipping') {
          this.clara.play('skipping');
        }
      }
    }else{
      if ((this.jack.spoke === true) && (!dialogue.typing) && (dialogue.hidden)) {
        this.jackLeaves();    
      }
    }


    //Scene 1 Ends When Jack Leaves
    if ((this.jack.spoke === true) && (!dialogue.typing) && (dialogue.hidden) && (this.scene === 1)) {
     this.jackLeaves(); 
    }

    //Scene 2 Ends When Jack sends you to find a rope and a light
    if ((this.jack.spoke === true) && (!dialogue.typing) && (dialogue.hidden) && (this.scene === 2) ) {
      this.scene = 3;
      localStorage.setItem('scene', '3'); 
      this.updateCharacterLines();
    }

    this.exitPoints.forEach(function(ep) {
      b1 = ep.getBounds();
      bp = player.sprite.getBounds();
      if (Phaser.Rectangle.intersects(b1,bp)) {
        console.log(ep.destination);
        if ((ep.destination != 'Well') ||  ((ep.destination === 'Well') && (this.haveLamp === true) && (this.haveRope === true))) {
          this.game.state.start(ep.destination);
        }
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
  //   this.jack.body.debug = true;
  // }

};

