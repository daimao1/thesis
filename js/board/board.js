var Board = {};

var map;
var grids = []; //TODO pola zwykłe
var specialGrids = []; //TODO pola specjalne
var playerGrid=[]; //dane gracza (np. położenie, awatar)


Board.preload = function () {
    board.load.image('plansza', 'assets/map/plansza.png'); //załaduj planszę
    board.load.spritesheet('avatar1','assets/sprites/boy.png');
};

Board.create = function () {
    board.stage.backgroundColor = "#4488AA";
    map = board.add.image(board.world.centerX,board.world.centerY,'plansza');
    map.anchor.setTo(0.5, 0.45);

    playerGrid[1] = board.add.sprite(32,32,'avatar1');
    playerGrid[1].anchor.setTo(-6.5, -9); //ustawienie gracza na start
};

Board.update = function () {

};

Board.render = function () {

};