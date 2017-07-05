var Game = {};

var sprite;
var text;

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    // game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
    // game.load.image('sprite', 'assets/sprites/sprite.png');
};

Game.create = function () {
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    Client.askNewPlayer();

    game.stage.backgroundColor = 0x5d5d5d;

    sprite = game.add.sprite(200, 200, 'pic');
    sprite.inputEnabled = true;
    sprite.input.enableDrag();

    var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#333333" };

    text = game.add.text(0, 0, "- text on a sprite -\ndrag me", style);
    text.anchor.set(0.5);

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(gofull, this);
};

Game.update = function () {

    text.x = Math.floor(sprite.x + sprite.width / 2);
    text.y = Math.floor(sprite.y + sprite.height / 2);
};

function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }
}

Game.addNewPlayer = function (id) {

    Game.playerMap[id] = game.add.sprite('sprite');

    var text = game.add.text(300, 64 + id * 32, 'Dodano przegladarke nr: '+id,  { font: "32px Arial", fill: "#f0f8ff" }); //dodanie napisu
    text.anchor.x = 0.5; //ustawienie napisu na środku osi X
};

Game.removePlayer = function (id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

