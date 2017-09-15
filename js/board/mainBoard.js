var board = new Phaser.Game(window.innerWidth-15.5, window.innerHeight-15.5, Phaser.AUTO, document.getElementById('board'));

board.state.add('Board', Board);
board.state.start('Board');