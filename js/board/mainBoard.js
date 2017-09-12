var board = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, document.getElementById('board'));

board.state.add('Board', Board);
board.state.start('Board');