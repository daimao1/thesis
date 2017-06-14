var StopTimeGame = {};

var text;
var timer = [];
var iHeight;
var iWidth;
var button_blue, button_yellow, button_green, button_red;
var aftertime;
var stop1_text, stop2_text, stop3_text, stop4_text;
var test;
var random_number;
var result = [];

StopTimeGame.socket = io.connect();

StopTimeGame.socket.on('stoptime', function (id) {
    timer[id].pause();
    result[id] = random_number - timer[id].ms;

});


//loading assets
StopTimeGame.preload = function () {
    stopTimeGame.load.spritesheet('button_blue', 'assets/buttons/circle_blue.png');
    stopTimeGame.load.spritesheet('button_yellow', 'assets/buttons/circle_yellow.png');
    stopTimeGame.load.spritesheet('button_red', 'assets/buttons/circle_red.png');
    stopTimeGame.load.spritesheet('button_green', 'assets/buttons/circle_green.png');
};


StopTimeGame.create = function () {
    iHeight = window.innerHeight;
    iWidth = window.innerWidth;
    goFullScreen();
    aftertime = false;


    //add buttons
    createButtons();
    //timer
    for (i = 1; i <= 4; i++) {
        timer[i] = stopTimeGame.time.create();
        timer[i].add(Phaser.Timer.SECOND * 30 + Phaser.Timer * 100, this, this.endTimer);
    }
    setTimeout(function () {
        for (i = 1; i <= 4; i++)
            timer[i].start()//????????????????
    }, 6000);//start with delay

    random_number = randomInt(6, 16);
    showTimeDestinationText(random_number);
};

StopTimeGame.update = function () {

};


function goFullScreen() {
    // setting a background color
    stopTimeGame.stage.backgroundColor = "#555555";
    stopTimeGame.scale.pageAlignHorizontally = true;
    stopTimeGame.scale.pageAlignVertically = true;

    // using RESIZE scale mode
    stopTimeGame.scale.scaleMode = Phaser.ScaleManager.RESIZE;

}


function createButtons() {
    button_blue = stopTimeGame.add.button(iWidth * 0.12, iHeight * 0.57, 'button_blue');
    button_yellow = stopTimeGame.add.button(iWidth * 0.34, iHeight * 0.57, 'button_yellow');
    button_red = stopTimeGame.add.button(iWidth * 0.56, iHeight * 0.57, 'button_red');
    button_green = stopTimeGame.add.button(iWidth * 0.78, iHeight * 0.57, 'button_green');

    stop1_text = stopTimeGame.add.text(iWidth * 0.137, iHeight * 0.63, 'STOP');
    stop1_text.fill = '#ffffff';
    stop2_text = stopTimeGame.add.text(iWidth * 0.356, iHeight * 0.63, 'STOP');
    stop2_text.fill = '#ffffff';
    stop3_text = stopTimeGame.add.text(iWidth * 0.577, iHeight * 0.63, 'STOP');
    stop3_text.fill = '#ffffff';
    stop4_text = stopTimeGame.add.text(iWidth * 0.797, iHeight * 0.63, 'STOP');
    stop4_text.fill = '#ffffff';
}

function showTimeDestinationText(random_number) {
    text = stopTimeGame.add.text(stopTimeGame.world.centerX, 100, "Czas docelowy: " + random_number);

    //	Center align text
    text.anchor.set(0.5);
    text.align = 'center';

    //	Font style
    text.font = 'Harrington';
    text.fontSize = 50;
    text.fontWeight = 'bold';

    //	Stroke color and thickness
    text.stroke = '#000000';
    text.strokeThickness = 6;
    text.fill = '#32c500';
}

function formatTime(s) {
    var seconds = "0" + Math.floor(s / 60);
    var milliseconds = "0" + (s - seconds * 60);
    return seconds.substr(-2) + ":" + milliseconds.substr(-2);
};

StopTimeGame.endTimer = function () {
    for (i = 1; i <= 4; i++)
        timer[i].stop();
};

function renderTime() {
    if (timer[1].running) {
        stopTimeGame.debug.text(formatTime(Math.round((timer[1].ms) / 16.6666)), iWidth * 0.142, iHeight * 0.8, "#ff0");
    }
    else if (aftertime === false) {
        {
            stopTimeGame.debug.text("Przygotuj się!", iWidth * 0.12, iHeight * 0.8, "#ff0");
        }

    }

    if (timer[2].running) {
        stopTimeGame.debug.text(formatTime(Math.round((timer[2].ms) / 16.6666)), iWidth * 0.363, iHeight * 0.8, "#ff0");
    }
    else if (aftertime === false) {
        stopTimeGame.debug.text("Przygotuj się!", iWidth * 0.34, iHeight * 0.8, "#ff0");
    }


    if (timer[3].running) {
        stopTimeGame.debug.text(formatTime(Math.round((timer[3].ms) / 16.6666)), iWidth * 0.583, iHeight * 0.8, "#ff0");
    }
    else if (aftertime === false) {
        {
            stopTimeGame.debug.text("Przygotuj się!", iWidth * 0.56, iHeight * 0.8, "#ff0");
        }
    }

    if (timer[4].running) {
        stopTimeGame.debug.text(formatTime(Math.round((timer[4].ms) / 16.6666)), iWidth * 0.803, iHeight * 0.8, "#ff0");
    }
    else if (aftertime === false) {
        {
            stopTimeGame.debug.text("Przygotuj się!", iWidth * 0.78, iHeight * 0.8, "#ff0");
        }
    }

    if (timer[1].ms > 20000 || timer[2].ms > 20000 || timer[3].ms > 20000 || timer[4].ms > 20000) {
        aftertime = true;
        this.endTimer();
    }
}
StopTimeGame.render = function () {
    renderTime.call(this);
};

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}



