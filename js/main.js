
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var game = new Phaser.Game(24 * 32, 17 * 32, Phaser.AUTO, document.getElementById('game'));
//var stopTimeGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, document.getElementById('stopTimeGame'))

game.state.add('Game', Game);
game.state.start('Game');

//stopTimeGame.state.add('StopTimeGame', StopTimeGame);
//stopTimeGame.state.start('StopTimeGame');