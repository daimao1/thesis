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
    generalTimer.start()
}

function showAllTextCounters(number) {
    switch (number) {
        case 6:
            showTextCounter(0, 0.09, 0.77, '')
            showTextCounter(1, 0.25, 0.77, '')
            showTextCounter(2, 0.42, 0.77, '')
            showTextCounter(3, 0.58, 0.77, '')
            showTextCounter(4, 0.75, 0.77, '')
            showTextCounter(5, 0.91, 0.77, '')
            break
        case 5:
            showTextCounter(0, 0.1, 0.77, '')
            showTextCounter(1, 0.3, 0.77, '')
            showTextCounter(2, 0.5, 0.77, '')
            showTextCounter(3, 0.7, 0.77, '')
            showTextCounter(4, 0.9, 0.77, '')
            break
        case 4:
            showTextCounter(0, 0.14, 0.77, '')
            showTextCounter(1, 0.38, 0.77, '')
            showTextCounter(2, 0.62, 0.77, '')
            showTextCounter(3, 0.86, 0.77, '')
            break
        case 3:
            showTextCounter(0, 0.2, 0.77, '')
            showTextCounter(1, 0.5, 0.77, '')
            showTextCounter(2, 0.8, 0.77, '')
            break
        case 2:
            showTextCounter(0, 0.35, 0.77, '')
            showTextCounter(1, 0.65, 0.77, '')
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
            button_blue = stopTimeGame.add.button(iWidth * 0.09, iHeight * 0.57, 'button_blue')
            button_blue.anchor.x = 0.5;
            button_yellow = stopTimeGame.add.button(iWidth * 0.25, iHeight * 0.57, 'button_yellow')
            button_yellow.anchor.x = 0.5;
            button_red = stopTimeGame.add.button(iWidth * 0.42, iHeight * 0.57, 'button_red')
            button_red.anchor.x = 0.5;
            button_green = stopTimeGame.add.button(iWidth * 0.58, iHeight * 0.57, 'button_green')
            button_green.anchor.x = 0.5;
            button_orange = stopTimeGame.add.button(iWidth * 0.75, iHeight * 0.57, 'button_orange')
            button_orange.anchor.x = 0.5;
            button_pink = stopTimeGame.add.button(iWidth * 0.91, iHeight * 0.57, 'button_pink')
            button_pink.anchor.x = 0.5;
            break
        case 5:
            button_blue = stopTimeGame.add.button(iWidth * 0.1, iHeight * 0.57, 'button_blue')
            button_blue.anchor.x = 0.5;
            button_yellow = stopTimeGame.add.button(iWidth * 0.3, iHeight * 0.57, 'button_yellow')
            button_yellow.anchor.x = 0.5;
            button_red = stopTimeGame.add.button(iWidth * 0.5, iHeight * 0.57, 'button_red')
            button_red.anchor.x = 0.5;
            button_green = stopTimeGame.add.button(iWidth * 0.7, iHeight * 0.57, 'button_green')
            button_green.anchor.x = 0.5;
            button_orange = stopTimeGame.add.button(iWidth * 0.9, iHeight * 0.57, 'button_orange')
            button_orange.anchor.x = 0.5;
            break
        case 4:
            button_blue = stopTimeGame.add.button(iWidth * 0.14, iHeight * 0.57, 'button_blue')
            button_blue.anchor.x = 0.5;
            button_yellow = stopTimeGame.add.button(iWidth * 0.38, iHeight * 0.57, 'button_yellow')
            button_yellow.anchor.x = 0.5;
            button_red = stopTimeGame.add.button(iWidth * 0.62, iHeight * 0.57, 'button_red')
            button_red.anchor.x = 0.5;
            button_green = stopTimeGame.add.button(iWidth * 0.86, iHeight * 0.57, 'button_green')
            button_green.anchor.x = 0.5;
            break
        case 3:
            button_blue = stopTimeGame.add.button(iWidth * 0.2, iHeight * 0.57, 'button_blue')
            button_blue.anchor.x = 0.5;
            button_yellow = stopTimeGame.add.button(iWidth * 0.5, iHeight * 0.57, 'button_yellow')
            button_yellow.anchor.x = 0.5;
            button_red = stopTimeGame.add.button(iWidth * 0.8, iHeight * 0.57, 'button_red')
            button_red.anchor.x = 0.5;
            break
        case 2:
            button_blue = stopTimeGame.add.button(iWidth * 0.35, iHeight * 0.57, 'button_blue')
            button_blue.anchor.x = 0.5;
            button_yellow = stopTimeGame.add.button(iWidth * 0.65, iHeight * 0.57, 'button_yellow')
            button_yellow.anchor.x = 0.5;
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
            players[0] = stopTimeGame.add.sprite(iWidth * 0.35, iHeight * 0.57, 'avatar1')
            players[0].anchor.x = 0.5
            players[1] = stopTimeGame.add.sprite(iWidth * 0.65, iHeight * 0.57, 'avatar2')
            players[1].anchor.x = 0.5
            showText(allPlayers[0].name, 0.35, 0.46)
            showText(allPlayers[1].name, 0.65, 0.46)
            break
        case 3:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.2, iHeight * 0.57, 'avatar1')
            players[0].anchor.x = 0.5
            players[1] = stopTimeGame.add.sprite(iWidth * 0.5, iHeight * 0.57, 'avatar2')
            players[1].anchor.x = 0.5
            players[2] = stopTimeGame.add.sprite(iWidth * 0.8, iHeight * 0.57, 'avatar3')
            players[2].anchor.x = 0.5
            showText(allPlayers[0].name, 0.2, 0.46)
            showText(allPlayers[1].name, 0.5, 0.46)
            showText(allPlayers[2].name, 0.8, 0.46)
            break
        case 4:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.14, iHeight * 0.57, 'avatar1')
            players[0].anchor.x = 0.5
            players[1] = stopTimeGame.add.sprite(iWidth * 0.38, iHeight * 0.57, 'avatar2')
            players[1].anchor.x = 0.5
            players[2] = stopTimeGame.add.sprite(iWidth * 0.62, iHeight * 0.57, 'avatar3')
            players[2].anchor.x = 0.5
            players[3] = stopTimeGame.add.sprite(iWidth * 0.86, iHeight * 0.57, 'avatar4')
            players[3].anchor.x = 0.5
            showText(allPlayers[0].name, 0.14, 0.46)
            showText(allPlayers[1].name, 0.38, 0.46)
            showText(allPlayers[2].name, 0.62, 0.46)
            showText(allPlayers[3].name, 0.86, 0.46)
            break
        case 5:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.1, iHeight * 0.57, 'avatar1')
            players[0].anchor.x = 0.5
            players[1] = stopTimeGame.add.sprite(iWidth * 0.3, iHeight * 0.57, 'avatar2')
            players[1].anchor.x = 0.5
            players[2] = stopTimeGame.add.sprite(iWidth * 0.5, iHeight * 0.57, 'avatar3')
            players[2].anchor.x = 0.5
            players[3] = stopTimeGame.add.sprite(iWidth * 0.7, iHeight * 0.57, 'avatar4')
            players[3].anchor.x = 0.5
            players[4] = stopTimeGame.add.sprite(iWidth * 0.9, iHeight * 0.57, 'avatar5')
            players[4].anchor.x = 0.5
            showText(allPlayers[0].name, 0.1, 0.46)
            showText(allPlayers[1].name, 0.3, 0.46)
            showText(allPlayers[2].name, 0.5, 0.46)
            showText(allPlayers[3].name, 0.7, 0.46)
            showText(allPlayers[4].name, 0.9, 0.46)
            break
        case 6:
            players[0] = stopTimeGame.add.sprite(iWidth * 0.09, iHeight * 0.57, 'avatar1')
            players[0].anchor.x = 0.5
            players[1] = stopTimeGame.add.sprite(iWidth * 0.25, iHeight * 0.57, 'avatar2')
            players[1].anchor.x = 0.5
            players[2] = stopTimeGame.add.sprite(iWidth * 0.42, iHeight * 0.57, 'avatar3')
            players[2].anchor.x = 0.5
            players[3] = stopTimeGame.add.sprite(iWidth * 0.58, iHeight * 0.57, 'avatar4')
            players[3].anchor.x = 0.5
            players[4] = stopTimeGame.add.sprite(iWidth * 0.75, iHeight * 0.57, 'avatar5')
            players[4].anchor.x = 0.5
            players[5] = stopTimeGame.add.sprite(iWidth * 0.91, iHeight * 0.57, 'avatar6')
            players[5].anchor.x = 0.5
            showText(allPlayers[0].name, 0.09, 0.46)
            showText(allPlayers[1].name, 0.25, 0.46)
            showText(allPlayers[2].name, 0.42, 0.46)
            showText(allPlayers[3].name, 0.58, 0.46)
            showText(allPlayers[4].name, 0.75, 0.46)
            showText(allPlayers[5].name, 0.91, 0.46)
    }
}

function showTextCounter(num, x, y, text) {
    textCounter[num] = stopTimeGame.add.text(iWidth * x, iHeight * y, text, {
        font: 'Orbitron',
        fontSize: 48,
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold'
        //backgroundColor: 'rgba(117, 117, 117, 0.7)'
    });
    textCounter[num].anchor.x = 0.5
}

function showText(text, x, y) {
    let textToShow = stopTimeGame.add.text(iWidth * x, iHeight * y, text, {
        font: 'Raleway',
        fontSize: 45,
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold'
    });
    textToShow.anchor.x = 0.5
}

function showInitMessage() {

    initMessage = stopTimeGame.add.bitmapText(stopTimeGame.world.centerX, stopTimeGame.world.centerY - 200, 'desyrel-pink', 'Przygotuj sie do gry...', 64)
    initMessage.fontSize = 85
    initMessage.anchor.set(0.5)
    //initMessage.fixedToCamera = true
    //initMessage.cameraOffset.setTo(iWidth / 4.2, iHeight / 12)
}

function showTimeDestinationText(random_number) {
    // text = stopTimeGame.add.bitmapText(iWidth / 3.6, iHeight / 6.0,
    //     'desyrel-pink', 'Traf w: ' + random_number + ' sekund', 85)
    text = stopTimeGame.add.bitmapText(stopTimeGame.world.centerX, stopTimeGame.world.centerY - 200,
        'desyrel-pink', 'Traf w: ' + random_number + ' sekund', 85);
    text.anchor.set(0.5)

    initMessage.destroy()
}

function showStartMessage() {
    startMessage = stopTimeGame.add.bitmapText(stopTimeGame.world.centerX, stopTimeGame.world.centerY - 110, 'desyrel-pink', 'START!  ', 64)
    startMessage.fontSize = 85
    startMessage.anchor.set(0.5)
    //startMessage.fixedToCamera = true
    //startMessage.cameraOffset.setTo(iWidth / 2.5, iHeight / 3.8)
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