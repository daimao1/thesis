let StopTimeGame = {}
let roomId = document.head.id
let socket

let players = []
let text
let iHeight
let iWidth
let button_blue, button_yellow, button_green, button_red, button_orange, button_pink
let random_number

let allPlayers
let numberOfPlayers
let counter = []
let textCounter = []

let generalTimer
let initMessage
let startMessage
let numberOfPlayersStopped
let timerSound
let socketResultsEmitted = false
let extraTimeForCounter

StopTimeGame.preload = function () {
    stopTimeGame.load.spritesheet('button_blue', '../../assets/buttons/circle_blue.png')
    stopTimeGame.load.spritesheet('button_yellow', '../../assets/buttons/circle_yellow.png')
    stopTimeGame.load.spritesheet('button_red', '../../assets/buttons/circle_red.png')
    stopTimeGame.load.spritesheet('button_green', '../../assets/buttons/circle_green.png')
    stopTimeGame.load.spritesheet('button_orange', '../../assets/buttons/circle_orange.png')
    stopTimeGame.load.spritesheet('button_pink', '../../assets/buttons/circle_pink.png')
    stopTimeGame.load.spritesheet('wood', '../../assets/buttons/wood.png')
    stopTimeGame.load.bitmapFont('desyrel-pink', '../../assets/fonts/bitmapFonts/desyrel-pink.png', '../../assets/fonts/bitmapFonts/desyrel-pink.xml')
    stopTimeGame.load.bitmapFont('desyrel', '../../assets/fonts/bitmapFonts/desyrel.png', '../../assets/fonts/bitmapFonts/desyrel.xml')

    stopTimeGame.load.spritesheet('avatar1', '../../assets/sprites/avatar1.png') //załaduj awatary
    stopTimeGame.load.spritesheet('avatar2', '../../assets/sprites/avatar2.png')
    stopTimeGame.load.spritesheet('avatar3', '../../assets/sprites/avatar3.png')
    stopTimeGame.load.spritesheet('avatar4', '../../assets/sprites/avatar4.png')
    stopTimeGame.load.spritesheet('avatar5', '../../assets/sprites/avatar5.png')
    stopTimeGame.load.spritesheet('avatar6', '../../assets/sprites/avatar6.png')
    stopTimeGame.load.image('bg', '../../assets/pictures/bg.jpg')

    stopTimeGame.load.audio('timerSound', '../../assets/audio/timerSound.mp3')

    socket = io.connect('/' + roomId)
    socket.emit('markStopTimeGame')
    setHandlers()
}

StopTimeGame.create = function () {
    stopTimeGame.stage.disableVisibilityChange = true
    iHeight = window.innerHeight
    iWidth = window.innerWidth
    timerSound = stopTimeGame.add.audio('timerSound')
    timerSound.volume = 0.3
    numberOfPlayersStopped = 0
    stopTimeGame.add.sprite(0, 0, 'bg')
    //showTextCountersWithZeros();

    goFullScreen()
    random_number = randomInt(7, 17)
    extraTimeForCounter = Math.ceil(random_number / 2)
    createButtonsWithAvatars(numberOfPlayers)

    showAllTextCounters(numberOfPlayers)
    initTextCountersWithZeros(numberOfPlayers)

    resetPlayersTime()
    showInitMessage()
    startGame()//do usunięcia jak android będzie miał event
}

function initTextCountersWithZeros(number) {
    for(let i = 0; i< number; i++){
        if(textCounter[i] !== undefined){
            textCounter[i].setText('00.00');
        }
    }
}

StopTimeGame.render = function () {
    if (numberOfPlayers !== undefined && random_number !== undefined) {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (textCounter[i] !== undefined && generalTimer !== undefined && generalTimer.running && !players[i].isStopped) {
                counter[i] = ((random_number * 1000 + extraTimeForCounter * 1000 - generalTimer.duration) / 1000).toFixed(2)
                if (counter[i].toString().length < 5) {
                    counter[i] = '0' + counter[i].toString();
                }
                textCounter[i].setText((counter[i]))
            }
        }
    }
};

function startGame() {
    setTimeout(function () {
        showTimeDestinationText(random_number)
    }, 2700)

    setTimeout(function () {
        showStartMessage()
        startTimers(numberOfPlayers)
        hideTimersWithDelay(numberOfPlayers)
        timerSound.play()
        socket.emit('stopTimeStartTimer')

    }, 5400)

    setTimeout(function () {
        startMessage.destroy()
    }, 6800)

}

function onTimerEnd() {

    generalTimer.stop()
    for (let i = 0; i < numberOfPlayers; i++) {
        if (!players[i].isStopped) {
            textCounter[i].setText((random_number + extraTimeForCounter).toFixed(2))
        }
    }

    if (socketResultsEmitted === false) {
        let random_number_ms = random_number * 100
        showResultsOnScreen()
        let arrayPlayers = arrayWithResults()
        console.log('random_number_ms ' + random_number_ms + 'arrayPlayers ' + arrayPlayers)
        socket.emit('stopTimeResults', random_number_ms, arrayPlayers)
    }
}

function startTimers(number) {
    generalTimer = stopTimeGame.time.create(false)
    generalTimer.loop(random_number * 1000 + extraTimeForCounter * 1000, onTimerEnd, this)

    for (let i = 0; i < number; i++) {
        counter[i] = 0
    }
    //showAllTextCounters(number);
    generalTimer.start()
}

function showAllTextCounters(number) {
    switch (number) {
        case 6:
            showTextCounter(0, 0.05, 0.76, '')
            showTextCounter(1, 0.23, 0.76, '')
            showTextCounter(2, 0.40, 0.76, '')
            showTextCounter(3, 0.57, 0.76, '')
            showTextCounter(4, 0.74, 0.76, '')
            showTextCounter(5, 0.91, 0.76, '')
            break
        case 5:
            showTextCounter(0, 0.14, 0.76, '')
            showTextCounter(1, 0.31, 0.76, '')
            showTextCounter(2, 0.48, 0.76, '')
            showTextCounter(3, 0.66, 0.76, '')
            showTextCounter(4, 0.82, 0.76, '')
            break
        case 4:
            showTextCounter(0, 0.2, 0.76, '')
            showTextCounter(1, 0.38, 0.76, '')
            showTextCounter(2, 0.55, 0.76, '')
            showTextCounter(3, 0.73, 0.76, '')
            break
        case 3:
            showTextCounter(0, 0.29, 0.76, '')
            showTextCounter(1, 0.47, 0.76, '')
            showTextCounter(2, 0.64, 0.75, '')
            break
        case 2:
            showTextCounter(0, 0.33, 0.76, '')
            showTextCounter(1, 0.52, 0.76, '')
            break
    }
}

function resetPlayersTime() {
    let tempTime = (random_number + extraTimeForCounter) * 1000
    for (let i = 0; i < numberOfPlayers; i++) {
        players[i].time = tempTime
        players[i].isStopped = false
    }
}

StopTimeGame.update = function () {
}

function setHandlers() {
    socket.once('playersInfo', playersInfo)
    socket.on('stopPlayerButton', stopButton)
    socket.once('clientReady', startGame)
}

function playersInfo(players) {
    allPlayers = players
    numberOfPlayers = allPlayers.length
    console.log('Liczba graczy ' + numberOfPlayers)
}

function goFullScreen() {
    stopTimeGame.scale.pageAlignHorizontally = true
    stopTimeGame.scale.pageAlignVertically = true
    stopTimeGame.scale.scaleMode = Phaser.ScaleManager.RESIZE
}

function hideTimersWithDelay(num) {
    let timeToHide = Math.ceil(random_number / 2 + 0.1) * 1000
    for (let i = 1; i < num; i++) {
        stopTimeGame.add.tween(textCounter[i]).to({alpha: 0}, timeToHide, "Linear", true);
    }
    let lastTween = stopTimeGame.add.tween(textCounter[0]).to({alpha: 0}, timeToHide, "Linear", true);
    lastTween.onComplete.add(onLastTweenComplete);
}

function onLastTweenComplete() {
    setTimeout(function () {
        for (let i = 0; i < numberOfPlayers; i++) {
            textCounter[i].visible = false;
            textCounter[i].alpha = 1;
        }
    }, 200);
}

function createButtonsWithAvatars(numberOfPlayers) {
    switch (numberOfPlayers) {
        case 6:
            button_blue = stopTimeGame.add.button(iWidth * 0.03, iHeight * 0.57, 'button_blue')
            button_yellow = stopTimeGame.add.button(iWidth * 0.20, iHeight * 0.57, 'button_yellow')
            button_red = stopTimeGame.add.button(iWidth * 0.37, iHeight * 0.57, 'button_red')
            button_green = stopTimeGame.add.button(iWidth * 0.54, iHeight * 0.57, 'button_green')
            button_orange = stopTimeGame.add.button(iWidth * 0.71, iHeight * 0.57, 'button_orange')
            button_pink = stopTimeGame.add.button(iWidth * 0.88, iHeight * 0.57, 'button_pink')
            break
        case 5:
            button_blue = stopTimeGame.add.button(iWidth * 0.11, iHeight * 0.57, 'button_blue')
            button_yellow = stopTimeGame.add.button(iWidth * 0.28, iHeight * 0.57, 'button_yellow')
            button_red = stopTimeGame.add.button(iWidth * 0.45, iHeight * 0.57, 'button_red')
            button_green = stopTimeGame.add.button(iWidth * 0.63, iHeight * 0.57, 'button_green')
            button_orange = stopTimeGame.add.button(iWidth * 0.79, iHeight * 0.57, 'button_orange')
            break
        case 4:
            button_blue = stopTimeGame.add.button(iWidth * 0.17, iHeight * 0.57, 'button_blue')
            button_yellow = stopTimeGame.add.button(iWidth * 0.35, iHeight * 0.57, 'button_yellow')
            button_red = stopTimeGame.add.button(iWidth * 0.52, iHeight * 0.57, 'button_red')
            button_green = stopTimeGame.add.button(iWidth * 0.70, iHeight * 0.57, 'button_green')
            break
        case 3:
            button_blue = stopTimeGame.add.button(iWidth * 0.26, iHeight * 0.57, 'button_blue')
            button_yellow = stopTimeGame.add.button(iWidth * 0.44, iHeight * 0.57, 'button_yellow')
            button_red = stopTimeGame.add.button(iWidth * 0.61, iHeight * 0.57, 'button_red')
            break
        case 2:
            button_blue = stopTimeGame.add.button(iWidth * 0.35, iHeight * 0.57, 'button_blue')
            button_yellow = stopTimeGame.add.button(iWidth * 0.54, iHeight * 0.57, 'button_yellow')
            break
    }
    addAvatars(numberOfPlayers)
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

function addAvatars(number) {
    switch (number) {
        case 2:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.37, iHeight * 0.57, 'avatar1')
            players[1] = stopTimeGame.add.sprite(iWidth * 0.56, iHeight * 0.57, 'avatar2')
            showText(allPlayers[0].name, 0.35, 0.45)
            showText(allPlayers[1].name, 0.54, 0.45)
            break
        case 3:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.28, iHeight * 0.57, 'avatar1')
            players[1] = stopTimeGame.add.sprite(iWidth * 0.46, iHeight * 0.57, 'avatar2')
            players[2] = stopTimeGame.add.sprite(iWidth * 0.63, iHeight * 0.57, 'avatar3')
            showText(allPlayers[0].name, 0.26, 0.45)
            showText(allPlayers[1].name, 0.44, 0.45)
            showText(allPlayers[2].name, 0.61, 0.45)
            break
        case 4:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.19, iHeight * 0.57, 'avatar1')
            players[1] = stopTimeGame.add.sprite(iWidth * 0.37, iHeight * 0.57, 'avatar2')
            players[2] = stopTimeGame.add.sprite(iWidth * 0.54, iHeight * 0.57, 'avatar3')
            players[3] = stopTimeGame.add.sprite(iWidth * 0.72, iHeight * 0.57, 'avatar4')
            showText(allPlayers[0].name, 0.17, 0.45)
            showText(allPlayers[1].name, 0.35, 0.45)
            showText(allPlayers[2].name, 0.52, 0.45)
            showText(allPlayers[3].name, 0.70, 0.45)
            break
        case 5:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.13, iHeight * 0.57, 'avatar1')
            players[1] = stopTimeGame.add.sprite(iWidth * 0.30, iHeight * 0.57, 'avatar2')
            players[2] = stopTimeGame.add.sprite(iWidth * 0.47, iHeight * 0.57, 'avatar3')
            players[3] = stopTimeGame.add.sprite(iWidth * 0.65, iHeight * 0.57, 'avatar4')
            players[4] = stopTimeGame.add.sprite(iWidth * 0.81, iHeight * 0.57, 'avatar5')
            showText(allPlayers[0].name, 0.11, 0.45)
            showText(allPlayers[1].name, 0.28, 0.45)
            showText(allPlayers[2].name, 0.46, 0.45)
            showText(allPlayers[3].name, 0.63, 0.45)
            showText(allPlayers[4].name, 0.79, 0.45)
            break
        case 6:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.05, iHeight * 0.45, 'avatar1')
            players[1] = stopTimeGame.add.sprite(iWidth * 0.22, iHeight * 0.45, 'avatar2')
            players[2] = stopTimeGame.add.sprite(iWidth * 0.39, iHeight * 0.45, 'avatar3')
            players[3] = stopTimeGame.add.sprite(iWidth * 0.56, iHeight * 0.45, 'avatar4')
            players[4] = stopTimeGame.add.sprite(iWidth * 0.73, iHeight * 0.45, 'avatar5')
            players[5] = stopTimeGame.add.sprite(iWidth * 0.90, iHeight * 0.45, 'avatar6')
            showText(allPlayers[0].name, 0.03, 0.4)
            showText(allPlayers[1].name, 0.21, 0.4)
            showText(allPlayers[2].name, 0.38, 0.4)
            showText(allPlayers[3].name, 0.54, 0.4)
            showText(allPlayers[4].name, 0.71, 0.4)
            showText(allPlayers[5].name, 0.88, 0.4)
    }
}

function showTextCounter(num, x, y, text) {
    textCounter[num] = stopTimeGame.add.text(iWidth * x, iHeight * y, text, {
        font: 'Orbitron',
        fontSize: 55,
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold'
        //backgroundColor: 'rgba(117, 117, 117, 0.7)'
    });
}

function showText(text, x, y) {
    stopTimeGame.add.text(iWidth * x, iHeight * y, text, {
        font: 'Raleway',
        fontSize: 45,
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold'
    });
}

function showInitMessage() {

    initMessage = stopTimeGame.add.bitmapText(1, 1, 'desyrel-pink', 'Przygotuj sie do gry...  ', 64)
    initMessage.fontSize = 85
    initMessage.fixedToCamera = true
    initMessage.cameraOffset.setTo(iWidth / 4.2, iHeight / 12)
}

function showTimeDestinationText(random_number) {
    text = stopTimeGame.add.bitmapText(iWidth / 3.6, iHeight / 6.0,
        'desyrel-pink', 'Traf w: ' + random_number + ' sekund', 85)
    initMessage.destroy()
}

function showStartMessage() {
    startMessage = stopTimeGame.add.bitmapText(1, 1, 'desyrel-pink', 'START!  ', 64)
    startMessage.fontSize = 85
    startMessage.fixedToCamera = true
    startMessage.cameraOffset.setTo(iWidth / 2.5, iHeight / 3.8)
}

function stopButton(playerId) {
    players[playerId].time = counter[playerId]
    players[playerId].isStopped = true

    switch (playerId) {
        case 5:
            button_pink.alpha = 0.4
            break
        case 4:
            button_orange.alpha = 0.4
            break
        case 3:
            button_green.alpha = 0.4
            break
        case 2:
            button_red.alpha = 0.4
            break
        case 1:
            button_yellow.alpha = 0.4
            break
        case 0:
            button_blue.alpha = 0.4
            break
    }
    if (numberOfPlayersStopped === numberOfPlayers) {
        socket.removeAllListeners('stopPlayerButton');
        showResultsOnScreen()
        let arrayPlayers = arrayWithResults()
        let random_number_ms = random_number * 100
        socket.emit('stopTimeResults', random_number_ms, arrayPlayers)
        socketResultsEmitted = true
        console.log('Wyslano emit stopTimeResults ' + 'random_number_ms: ' + random_number_ms + ' arrayPlayers' + arrayPlayers)
        console.log('Pierwszy gracz czas: ' + counter[0])
        console.log()
        redirectToBoard();
    }
}

function showResultsOnScreen() {
    for (let i = 0; i < numberOfPlayers; i++) {
        textCounter[i].visible = true
    }

}

function arrayWithResults() {
    let arrayWithPlayers = []
    let temp = (random_number + extraTimeForCounter) * 100

    for (let i = 0; i < numberOfPlayers; i++) {
        arrayWithPlayers[i] = counter[i] * 100
        if (!players[i].isStopped) {
            players[i].time = temp
            arrayWithPlayers[i] = temp
        }
    }
    return arrayWithPlayers
}

function redirectToBoard() {
    setTimeout(function () {
        window.location.href = '/board/' + roomId
    }, 7000)
}