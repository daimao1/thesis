let board = new Phaser.Game(window.innerWidth-16, window.innerHeight-16, Phaser.AUTO, document.getElementById('board'),);

board.state.add('Board', Board);
board.state.start('Board');