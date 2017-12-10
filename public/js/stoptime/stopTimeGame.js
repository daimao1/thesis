let StopTimeGame = {}
let roomId = document.head.id

let player1, player2, player3, player4, player5, player6
let text
let iHeight
let iWidth
let button_blue, button_yellow, button_green, button_red, button_orange, button_pink
let test
let random_number

let allPlayers
let numberOfPlayers
let counter = []
let textCounter = []
let timerEvents = []

let generalTimer
let generalCounter
let initMessage
let startMessage
let numberOfPlayersStopped
let timerSound
let socketResultsEmitted = false

WebFontConfig = {

  //  'active' means all requested fonts have finished loading
  //  We set a 1 second delay before calling 'createText'.
  //  For some reason if we don't the browser cannot render the text the first time it's created.
  //active: function() { stopTimeGame.time.events.add(Phaser.Timer.SECOND, createText, this); },

  //  The Google Fonts we want to load (specify as many as you like in the array)
  google: {
    families: ['Raleway']
  }

};

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

  stopTimeGame.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

  socket = io.connect('/' + roomId)
  socket.emit('markStopTimeGame')
  setHandlers()
}

StopTimeGame.create = function () {
  stopTimeGame.stage.disableVisibilityChange = true; //gra działa gdy okno przeglądarki jest nieaktywne
  iHeight = window.innerHeight
  iWidth = window.innerWidth
  timerSound = stopTimeGame.add.audio('timerSound')
  timerSound.volume = 0.3
  generalCounter = 0
  numberOfPlayersStopped = 0
  stopTimeGame.add.image('bg').anchor.set(0.5)

  goFullScreen()
  random_number = randomInt(7, 17)
  createButtonsWithAvatars(numberOfPlayers)
  resetPlayersTime(numberOfPlayers)
  showInitMessage()
  startGame()//do usunięcia jak android będzie miał event
}

StopTimeGame.render = function () {
  if(numberOfPlayers !== undefined) {
      for (let i = 0; i < numberOfPlayers; i++) {
          if(textCounter[i] !== undefined) {
              counter[i] = timerEvents[i].duration.toFixed(0);
              textCounter[i].setText((counter[i]))
          }
      }
  }
}

function startGame(){
  setTimeout(function () {
    showTimeDestinationText(random_number)
  }, 2700)

  setTimeout(function () {
    showStartMessage()
    makeTimers(numberOfPlayers)
    hideTimersWithDelay(numberOfPlayers)
    timerSound.play()
    socket.emit('stopTimeStartTimer')

  }, 5400)

  setTimeout(function () {
    startMessage.destroy()
  }, 6800)

  let temp = 6800 + (random_number * 1000) + 7000

  setTimeout(function () {
    if(socketResultsEmitted === false) {
      let random_number_ms = random_number * 1000
      for (let i = 0; i < numberOfPlayers; i++)
        timerEvents[i].stop()
      // console.log('COUNTER: ' + generalCounter)
      showResultsOnScreen()
      let arrayPlayers = arrayWithResults()
      console.log('random_number_ms ' + random_number_ms + 'arrayPlayers ' + arrayPlayers)
      socket.emit('stopTimeResults', random_number_ms, arrayPlayers)
      redirectToBoard()
      // console.log('Wyslano emit stopTimeResults')
    }
  }, temp)
}

function makeTimers (number) {
  generalTimer = stopTimeGame.time.create(false)
  generalTimer.loop(Phaser.Timer.SECOND, updateGeneralCounter, this)
  generalTimer.start()

  for (let i = 0; i < number; i++) {
    counter[i] = 0

    switch (number) {
      case 6:
        showTextCounter(0, 0.05, 0.75, '')
        showTextCounter(1, 0.23, 0.75, '')
        showTextCounter(2, 0.40, 0.75, '')
        showTextCounter(3, 0.57, 0.75, '')
        showTextCounter(4, 0.74, 0.75, '')
        showTextCounter(5, 0.91, 0.75, '')
        break
      case 5:
        showTextCounter(0, 0.14, 0.75, '')
        showTextCounter(1, 0.31, 0.75, '')
        showTextCounter(2, 0.48, 0.75, '')
        showTextCounter(3, 0.66, 0.75, '')
        showTextCounter(4, 0.82, 0.75, '')
        break
      case 4:
        showTextCounter(0, 0.2, 0.75, '')
        showTextCounter(1, 0.38, 0.75, '')
        showTextCounter(2, 0.55, 0.75, '')
        showTextCounter(3, 0.73, 0.75, '')
        break
      case 3:
        showTextCounter(0, 0.29, 0.75, '')
        showTextCounter(1, 0.47, 0.75, '')
        showTextCounter(2, 0.64, 0.75, '')
        break
      case 2:
        showTextCounter(0, 0.38, 0.75, '')
        showTextCounter(1, 0.57, 0.75, '')
        break

    }
    timerEvents[i] = stopTimeGame.time.create(false)
    //timerEvents[i].loop(Phaser.Timer.SECOND / 100, updateCounter, this, i)
      timerEvents[i].loop(random_number * 1000 + 7000, updateCounter, this, i)
    timerEvents[i].start()
  }
}

function updateGeneralCounter () {
  generalCounter++
}

function updateCounter (index) {
  console.log('timer end'); //TODO remove
  //counter[index]++
  //textCounter[index].setText((counter[index] * 0.01).toFixed(2))
  //console.log(counter[index])
}

function resetPlayersTime (number) {
  let tempTime = (random_number + 7) * 100
  switch (number) {
    case 6:
      player6.time = tempTime
      player6.isStopped = false
    case 5:
      player5.time = tempTime
      player5.isStopped = false
    case 4:
      player4.time = tempTime
      player4.isStopped = false
    case 3:
      player3.time = tempTime
      player3.isStopped = false
    case 2:
      player2.time = tempTime
      player2.isStopped = false
      player1.time = tempTime
      player1.isStopped = false
  }
}

StopTimeGame.update = function () {
}

function setHandlers () {
  socket.on('playersInfo', playersInfo)
  socket.on('stopPlayerButton', stopButton)
  socket.on('clientReady',startGame)
}

function playersInfo (players) {
  allPlayers = players
  numberOfPlayers = allPlayers.length
  console.log('Liczba graczy ' + numberOfPlayers)
}

function goFullScreen () {
  stopTimeGame.scale.pageAlignHorizontally = true
  stopTimeGame.scale.pageAlignVertically = true
  stopTimeGame.scale.scaleMode = Phaser.ScaleManager.RESIZE
}

function hideTimersWithDelay (num) {
  const hide = Math.ceil(random_number / 2) * 1000
  console.log(hide)
  setTimeout(function () {
    for (let i = 0; i < num; i++) {
      textCounter[i].visible = false
    }
  }, hide)
}

function createButtonsWithAvatars (numberOfPlayers) {
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

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

function addAvatars (number) {
  switch (number) {
    case 2:
      player1 = stopTimeGame.add.sprite(iWidth * 0.37, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.56, iHeight * 0.57, 'avatar2')
      showText(allPlayers[0].name, 0.35, 0.45)
      showText(allPlayers[1].name, 0.54, 0.45)
      break
    case 3:
      player1 = stopTimeGame.add.sprite(iWidth * 0.28, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.46, iHeight * 0.57, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.63, iHeight * 0.57, 'avatar3')
      showText(allPlayers[0].name, 0.26, 0.45)
      showText(allPlayers[1].name, 0.44, 0.45)
      showText(allPlayers[2].name, 0.61, 0.45)
      break
    case 4:
      player1 = stopTimeGame.add.sprite(iWidth * 0.19, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.37, iHeight * 0.57, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.54, iHeight * 0.57, 'avatar3')
      player4 = stopTimeGame.add.sprite(iWidth * 0.72, iHeight * 0.57, 'avatar4')
      showText(allPlayers[0].name, 0.17, 0.45)
      showText(allPlayers[1].name, 0.35, 0.45)
      showText(allPlayers[2].name, 0.52, 0.45)
      showText(allPlayers[3].name, 0.70, 0.45)
      break
    case 5:
      player1 = stopTimeGame.add.sprite(iWidth * 0.13, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.30, iHeight * 0.57, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.47, iHeight * 0.57, 'avatar3')
      player4 = stopTimeGame.add.sprite(iWidth * 0.65, iHeight * 0.57, 'avatar4')
      player5 = stopTimeGame.add.sprite(iWidth * 0.81, iHeight * 0.57, 'avatar5')
      showText(allPlayers[0].name, 0.11, 0.45)
      showText(allPlayers[1].name, 0.28, 0.45)
      showText(allPlayers[2].name, 0.46, 0.45)
      showText(allPlayers[3].name, 0.63, 0.45)
      showText(allPlayers[4].name, 0.79, 0.45)
      break
    case 6:
      player1 = stopTimeGame.add.sprite(iWidth * 0.05, iHeight * 0.45, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.22, iHeight * 0.45, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.39, iHeight * 0.45, 'avatar3')
      player4 = stopTimeGame.add.sprite(iWidth * 0.56, iHeight * 0.45, 'avatar4')
      player5 = stopTimeGame.add.sprite(iWidth * 0.73, iHeight * 0.45, 'avatar5')
      player6 = stopTimeGame.add.sprite(iWidth * 0.90, iHeight * 0.45, 'avatar6')
      showText(allPlayers[0].name, 0.03, 0.4)
      showText(allPlayers[1].name, 0.21, 0.4)
      showText(allPlayers[2].name, 0.38, 0.4)
      showText(allPlayers[3].name, 0.54, 0.4)
      showText(allPlayers[4].name, 0.71, 0.4)
      showText(allPlayers[5].name, 0.88, 0.4)
  }

}

function showTextCounter (num, x, y, text) {
  textCounter[num] = stopTimeGame.add.text(iWidth * x, iHeight * y, text, {
    font: 'Raleway',
    fontSize: 45,
    fill: '#ffffff',
    align: 'center'
  })
}

function showText (text, x, y) {
  stopTimeGame.add.text(iWidth * x, iHeight * y, text, {
    font: 'Raleway',
    fontSize: 45,
    fill: '#ffffff',
    align: 'center'
  })
}

function showInitMessage () {

  initMessage = stopTimeGame.add.bitmapText(1, 1, 'desyrel-pink', 'Przygotuj sie do gry...  ', 64)
  initMessage.fontSize = 85
  initMessage.fixedToCamera = true
  initMessage.cameraOffset.setTo(iWidth / 4.2, iHeight / 12)
}

function showTimeDestinationText (random_number) {
  text = stopTimeGame.add.bitmapText(iWidth / 3.6, iHeight / 6.0,
    'desyrel-pink', 'Traf w: ' + random_number + ' sekund', 85)
  initMessage.destroy()
}

function showStartMessage () {
  startMessage = stopTimeGame.add.bitmapText(1, 1, 'desyrel-pink', 'START!  ', 64)
  startMessage.fontSize = 85
  startMessage.fixedToCamera = true
  startMessage.cameraOffset.setTo(iWidth / 2.5, iHeight / 3.8)
}

function stopButton (playerId) {
  timerEvents[playerId].stop()
  switch (playerId) {
    case 5:
      player6.time = counter[playerId]
      player6.isStopped = true
      button_pink.alpha = 0.4
      break
    case 4:
      player5.time = counter[playerId]
      player5.isStopped = true
      button_orange.alpha = 0.4
      break
    case 3:
      player4.time = counter[playerId]
      player4.isStopped = true
      button_green.alpha = 0.4
      break
    case 2:
      player3.time = counter[playerId]
      player3.isStopped = true
      button_red.alpha = 0.4
      break
    case 1:
      player2.time = counter[playerId]
      player2.isStopped = true
      button_yellow.alpha = 0.4
      break
    case 0:
      player1.time = counter[playerId]
      player1.isStopped = true
      button_blue.alpha = 0.4
      break
  }
  numberOfPlayersStopped++
  if (numberOfPlayersStopped === numberOfPlayers) {
    showResultsOnScreen()
    let arrayPlayers = arrayWithResults()
    let random_number_ms = random_number * 1000
    socket.emit('stopTimeResults', random_number_ms, arrayPlayers)
    socketResultsEmitted = true;
    console.log('Wyslano emit stopTimeResults ' + 'random_number_ms: ' + random_number_ms + ' arrayPlayers' + arrayPlayers)
    console.log('Pierwszy gracz czas: ' + counter[0])
    console.log()
  }
}

function showResultsOnScreen () {
  switch (numberOfPlayers) {
    case 2:
      console.log('player1.time: ' +player1.time.toFixed(2) / 100)
      showTextCounter(0, 0.38, 0.75, player1.time.toFixed(2) / 100)
      showTextCounter(1, 0.57, 0.75, player2.time.toFixed(2) / 100)
      break
    case 3:
      showTextCounter(0, 0.29, 0.75, player1.time)
      showTextCounter(1, 0.47, 0.75, player2.time)
      showTextCounter(2, 0.64, 0.75, player3.time)
      break
    case 4:
      showTextCounter(0, 0.2, 0.75, player1.time.toFixed(2))
      showTextCounter(1, 0.38, 0.75, player2.time.toFixed(2))
      showTextCounter(2, 0.55, 0.75, player3.time.toFixed(2))
      showTextCounter(3, 0.73, 0.75, player4.time.toFixed(2))
      break
    case 5:
      showTextCounter(0, 0.14, 0.75, player1.time.toFixed(2))
      showTextCounter(1, 0.31, 0.75, player2.time.toFixed(2))
      showTextCounter(2, 0.48, 0.75, player3.time.toFixed(2))
      showTextCounter(3, 0.66, 0.75, player4.time.toFixed(2))
      showTextCounter(4, 0.82, 0.75, player5.time.toFixed(2))
      break
    case 6:
      showTextCounter(0, 0.05, 0.75, player1.time.toFixed(2))
      showTextCounter(1, 0.23, 0.75, player2.time.toFixed(2))
      showTextCounter(2, 0.40, 0.75, player3.time.toFixed(2))
      showTextCounter(3, 0.57, 0.75, player4.time.toFixed(2))
      showTextCounter(4, 0.74, 0.75, player5.time.toFixed(2))
      showTextCounter(5, 0.91, 0.75, player6.time.toFixed(2))
      break
  }
  redirectToBoard();
}

function arrayWithResults () {
  let arrayWithPlayers = []
  let temp = (random_number + 7) * 1000
  for (let i = 0; i < numberOfPlayers; i++) {
    arrayWithPlayers[i] = counter[i] * 10
  }

  switch(numberOfPlayers){
    case 6:
      if(player6.isStopped === false){
        player6.time = temp
        arrayWithPlayers[5] = temp;
      }
    case 5:
      if(player5.isStopped === false){
        player5.time = temp
        arrayWithPlayers[4] = temp;
      }
    case 4:

      if(player4.isStopped === false){
        player4.time = temp
        arrayWithPlayers[3] = temp;
      }
    case 3:
      if(player3.isStopped === false){
        player3.time = temp
        arrayWithPlayers[2] = temp;
      }
    case 2:
      if(player1.isStopped === false){
        player1.time = temp
        arrayWithPlayers[1] = temp;
      }
      console.log('temp '+temp)
      if(player2.isStopped === false){
        player2.time = temp
        arrayWithPlayers[0] = temp;
      }
      break
  }

  return arrayWithPlayers

}

function redirectToBoard() {
  setTimeout(function () {
    window.location.href = "/board/" + roomId;
  }, 7000);
}