var stopTimeGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, document.getElementById('stopTimeGame'));

stopTimeGame.state.add('StopTimeGame', StopTimeGame);
stopTimeGame.state.start('StopTimeGame');