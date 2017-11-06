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

//var music;

var distance = 400;
var speed = 2.7;
var stars;

var max = 130;
var xx = [];
var yy = [];
var zz = [];

StopTimeGame.socket = io.connect();

StopTimeGame.socket.on('stopTime', function (id) {
    timer[id].pause();
    result[id] = Math.abs(random_number - timer[id].ms); //obliczam wynik

});


//loading assets
StopTimeGame.preload = function () {
    stopTimeGame.load.spritesheet('button_blue', 'assets/buttons/circle_blue.png');
    stopTimeGame.load.spritesheet('button_yellow', 'assets/buttons/circle_yellow.png');
    stopTimeGame.load.spritesheet('button_red', 'assets/buttons/circle_red.png');
    stopTimeGame.load.spritesheet('button_green', 'assets/buttons/circle_green.png');
    stopTimeGame.load.spritesheet('wood', 'assets/buttons/wood.png');
    stopTimeGame.load.image('star', 'assets/pictures/stoptime/star.png')

    stopTimeGame.load.bitmapFont('desyrel-pink', 'assets/fonts/bitmapFonts/desyrel-pink.png', 'assets/fonts/bitmapFonts/desyrel-pink.xml');

   //stopTimeGame.load.audio('intro','assets/audio/intro_stoptime.mp3');
};


StopTimeGame.create = function () {
    iHeight = window.innerHeight;
    iWidth = window.innerWidth;

    generateBackgroundAnimation();
    //tileSprite = stopTimeGame.add.tileSprite(0, 0, 1600, 900, 'starfield');
    goFullScreen();
    aftertime = false;
    
    createButtons();
    //timer
    timerInit();

    random_number = randomInt(6, 20);
    showTimeDestinationText(random_number);
};


StopTimeGame.update = function () {
for (var i = 0; i < max; i++)
    {
        stars[i].perspective = distance / (distance - zz[i]);
        stars[i].x = stopTimeGame.world.centerX + xx[i] * stars[i].perspective;
        stars[i].y = stopTimeGame.world.centerY + yy[i] * stars[i].perspective;

        zz[i] += speed;

        if (zz[i] > 290)
        {
            zz[i] -= 600;
        }

        stars[i].alpha = Math.min(stars[i].perspective / 2, 1);
        stars[i].scale.set(stars[i].perspective / 2);
        stars[i].rotation += 0.1;

    }
};

StopTimeGame.render = function () {
    renderTime.call(this);
};


function goFullScreen() {
    // setting a background color
    //stopTimeGame.stage.backgroundColor = "#2F4F4F";
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

function generateBackgroundAnimation(){
if (stopTimeGame.renderType === Phaser.WEBGL) {
        max = 2000;
    }

    var sprites = stopTimeGame.add.spriteBatch();

    stars = [];

    for (var i = 0; i < max; i++) {
        xx[i] = Math.floor(Math.random() * 800) - 400;
        yy[i] = Math.floor(Math.random() * 600) - 300;
        zz[i] = Math.floor(Math.random() * 1700) - 100;

        var star = stopTimeGame.make.sprite(0, 0, 'star');
        star.anchor.set(0.5);

        sprites.addChild(star);

        stars.push(star);
    }
}

function timerInit(){
    for (let i = 1; i <= 4; i++) {
        timer[i] = stopTimeGame.time.create();
        timer[i].add(Phaser.Timer.SECOND * 30 + Phaser.Timer * 100, this, this.endTimer);
    }
    setTimeout(function () {
        for (let i = 1; i <= 4; i++)
            timer[i].start()//????????????????
    }, 5000);//start with delay
}

function showTimeDestinationText(random_number) {
    text = stopTimeGame.add.bitmapText(stopTimeGame.world.centerX-iWidth*0.20, iHeight * 0.06, 
    'desyrel-pink', "Traf w: " + random_number + " sekund", 80);

}

function formatTime(s) {
    var seconds = "0" + Math.floor(s / 60);
    var milliseconds = "0" + (s - seconds * 60);
    return seconds.substr(-2) + ":" + milliseconds.substr(-2);
};

StopTimeGame.endTimer = function () {
    for (let i = 1; i <= 4; i++)
        timer[i].stop();
};
//
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

    if (timer[1].ms > 30000 || timer[2].ms > 30000 || timer[3].ms > 30000 || timer[4].ms > 30000) {
        aftertime = true;
        this.endTimer();
        this.alpha = 0.5;
    }

    if(timer[1].ms > 4000){
       // wood = stopTimeGame.add.button(iWidth * 0.135, iHeight * 0.75, 'wood');
      //  wood.scale.setTo(0.15);
    }
}


function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}



