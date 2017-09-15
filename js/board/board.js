let Board = {};

let map;
let grids = [[]]; //TODO pola zwykłe
let specialGrids = []; //TODO pola specjalne
let players = [];
let iHeight = window.innerHeight;
let iWidth = window.innerWidth;
let mapBackground;
let sprite;
let cursors;

//TODO: koncepcja z tablicą graczy jest do niczego - zrobić na obiektach!
Board.preload = function () {
    board.load.image('plansza', 'assets/map/plansza.png'); //załaduj planszę
    board.load.image('background', 'assets/map/wood_background.png');
    board.load.spritesheet('avatar1', 'assets/sprites/avatar1.png'); //załaduj awatary
    board.load.spritesheet('avatar2', 'assets/sprites/avatar2.png');
    board.load.spritesheet('avatar3', 'assets/sprites/avatar3.png');
    board.load.spritesheet('avatar4', 'assets/sprites/avatar4.png');
    board.load.spritesheet('avatar5', 'assets/sprites/avatar5.png');
    board.load.spritesheet('avatar6', 'assets/sprites/avatar6.png');
};

Board.create = function () {


    mapBackground = board.add.tileSprite(0, 0, 4573, 4605, "background");
     board.world.setBounds(0, 0, 4573, 4605);
    map = board.add.image(4573,4605,'plansza');
    map.anchor.setTo(1,1 ); //położenie lewej górnej krawędzi obrazka - ta wartość będzie ulegać zmianie
    //map.scale.setTo(0.9);
    board.physics.startSystem(Phaser.Physics.P2JS);
    sprite = board.add.sprite(130.0813, 485, 'avatar1');
    board.physics.p2.enable(sprite);
    board.camera.follow(sprite);
    cursors = board.input.keyboard.createCursorKeys();

   // addPlayersToBoard(6);

    //board.camera.follow(players[0]);
};

Board.update = function () {
sprite.body.setZeroVelocity();

  if (cursors.up.isDown)
  {
    sprite.body.moveUp(300)
  }
  else if (cursors.down.isDown)
  {
    sprite.body.moveDown(300);
  }

  if (cursors.left.isDown)
  {
    sprite.body.velocity.x = -300;
  }
  else if (cursors.right.isDown)
  {
    sprite.body.moveRight(300);
  }
};

Board.render = function () {
  board.debug.cameraInfo(board.camera, 32, 32);
  board.debug.spriteCoords(sprite, 32, 500);
};

function addPlayersToBoard(numberOfPlayers) {

    switch (numberOfPlayers) {
        case 6:
            players[5] = board.add.sprite(205.1282, 533, 'avatar6');
        case 5:
            players[4] = board.add.sprite(168.4210, 533, 'avatar5');
        case 4:
            players[3] = board.add.sprite(130.0813, 533, 'avatar4');
        case 3:
            players[2] = board.add.sprite(205.1282, 485, 'avatar3');
        case 2:
            players[1] = board.add.sprite(168.4210, 485, 'avatar2');
        case 1:
            players[0] = board.add.sprite(130.0813, 485, 'avatar1');

    }
    }

function changePlayerPosition(players, x, y) {
    players.anchor.setTo(x,y);
}