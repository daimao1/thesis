let StopTimeGame = {}
let roomId = document.head.id

let player1, player2, player3, player4, player5, player6
let text
let iHeight
let iWidth
let button_blue, button_yellow, button_green, button_red, button_orange, button_pink
let stop1_text, stop2_text, stop3_text, stop4_text
let test
let random_number
let distance = 400
let speed = 2.7
let stars

let max = 130
let xx = []
let yy = []
let zz = []

let allPlayers
let numberOfPlayers
let counter = []
let textCounter = []
let timerEvents = []

StopTimeGame.preload = function () {
  stopTimeGame.load.spritesheet('button_blue', 'assets/buttons/circle_blue.png')
  stopTimeGame.load.spritesheet('button_yellow', 'assets/buttons/circle_yellow.png')
  stopTimeGame.load.spritesheet('button_red', 'assets/buttons/circle_red.png')
  stopTimeGame.load.spritesheet('button_green', 'assets/buttons/circle_green.png')
  stopTimeGame.load.spritesheet('button_orange', 'assets/buttons/circle_orange.png')
  stopTimeGame.load.spritesheet('button_pink', 'assets/buttons/circle_pink.png')
  stopTimeGame.load.spritesheet('wood', 'assets/buttons/wood.png')
  stopTimeGame.load.image('star', 'assets/pictures/stoptime/star.png')
  stopTimeGame.load.bitmapFont('desyrel-pink', 'assets/fonts/bitmapFonts/desyrel-pink.png', 'assets/fonts/bitmapFonts/desyrel-pink.xml')

  stopTimeGame.load.spritesheet('avatar1', '../assets/sprites/avatar1.png') //załaduj awatary
  stopTimeGame.load.spritesheet('avatar2', '../assets/sprites/avatar2.png')
  stopTimeGame.load.spritesheet('avatar3', '../assets/sprites/avatar3.png')
  stopTimeGame.load.spritesheet('avatar4', '../assets/sprites/avatar4.png')
  stopTimeGame.load.spritesheet('avatar5', '../assets/sprites/avatar5.png')
  stopTimeGame.load.spritesheet('avatar6', '../assets/sprites/avatar6.png')

  socket = io.connect('/' + roomId)
  setHandlers()
  socket.emit('markStopTimeGame')
}

StopTimeGame.create = function () {
  iHeight = window.innerHeight
  iWidth = window.innerWidth

  goFullScreen()

  random_number = randomInt(7, 17)
  showTimeDestinationText(random_number)
  generateBackgroundAnimation()
  createButtonsWithAvatars(6)
  resetPlayersTime(6)
  makeTimers(6)
  hideTimersWithDelay(6)
  socket.emit('stopTimeGameReady')
  }

function makeTimers(number) {
  for (let i = 0; i < number; i++) {
    counter[i] = 0

    switch(number) {
      case 6:
        showTextCounter(0,0.05, 0.75)
        showTextCounter(1,0.23, 0.75)
        showTextCounter(2,0.40, 0.75)
        showTextCounter(3,0.57, 0.75)
        showTextCounter(4,0.74, 0.75)
        showTextCounter(5,0.91, 0.75)
        break
      case 5:
        showTextCounter(0,0.14, 0.75)
        showTextCounter(1,0.31, 0.75)
        showTextCounter(2,0.48, 0.75)
        showTextCounter(3,0.66, 0.75)
        showTextCounter(4,0.82, 0.75)
break
      case 4:
        showTextCounter(0,0.2, 0.75)
        showTextCounter(1,0.38, 0.75)
        showTextCounter(2,0.55, 0.75)
        showTextCounter(3,0.73, 0.75)
        break
      case 3:
        showTextCounter(0,0.29, 0.75)
        showTextCounter(1,0.47, 0.75)
        showTextCounter(2,0.64, 0.75)
        break
      case 2:
        showTextCounter(0,0.38, 0.75)
        showTextCounter(1,0.57, 0.75)
      break

    }
    timerEvents[i] = stopTimeGame.time.events.loop(Phaser.Timer.SECOND, updateCounter, this, i)

  }
}

function showTextCounter(num,x,y){
  textCounter[num] = stopTimeGame.add.text(iWidth * x, iHeight * y, '', {
    font: "45px Arial",
    fill: "#ffffff",
    align: "center"
  })
}

function updateCounter(index) {
  counter[index]++;
  textCounter[index].setText(counter[index]);
}
function resetPlayersTime(number) {
  switch(number){
    case 6:
      player6.time=0
    case 5:
      player5.time=0
    case 4:
      player4.time=0
    case 3:
      player3.time=0
    case 2:
      player2.time=0
      player1.time=0
  }
}

function hideTimersWithDelay(num) {
  const hide = Math.ceil(random_number/3)*1000
  console.log(hide)
  setTimeout(function() {
  for(let i = 0; i<num; i++) {
    textCounter[i].visible = false;
  }
}, hide)
}


StopTimeGame.update = function () {
  for (let i = 0; i < max; i++) {
    stars[i].perspective = distance / (distance - zz[i])
    stars[i].x = stopTimeGame.world.centerX + xx[i] * stars[i].perspective
    stars[i].y = stopTimeGame.world.centerY + yy[i] * stars[i].perspective
    zz[i] += speed
    if (zz[i] > 290) {
      zz[i] -= 600
    }
    stars[i].alpha = Math.min(stars[i].perspective / 2, 1)
    stars[i].scale.set(stars[i].perspective / 2)
    stars[i].rotation += 0.1

  }
}

function setHandlers () {
  socket.on('playersInfo', playersInfo)
}

function playersInfo(players){
  allPlayers = players
  numberOfPlayers = allPlayers.length

}

function goFullScreen () {
  stopTimeGame.scale.pageAlignHorizontally = true
  stopTimeGame.scale.pageAlignVertically = true
  stopTimeGame.scale.scaleMode = Phaser.ScaleManager.RESIZE
}

function createButtonsWithAvatars (numberOfPlayers) {
  switch(numberOfPlayers){
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


  // stop1_text = stopTimeGame.add.text(iWidth * 0.137, iHeight * 0.63, 'STOP')
  // stop1_text.fill = '#ffffff'
  // stop2_text = stopTimeGame.add.text(iWidth * 0.356, iHeight * 0.63, 'STOP')
  // stop2_text.fill = '#ffffff'
  // stop3_text = stopTimeGame.add.text(iWidth * 0.577, iHeight * 0.63, 'STOP')
  // stop3_text.fill = '#ffffff'
  // stop4_text = stopTimeGame.add.text(iWidth * 0.797, iHeight * 0.63, 'STOP')
  // stop4_text.fill = '#ffffff'
}

function generateBackgroundAnimation () {
  if (stopTimeGame.renderType === Phaser.WEBGL) {
    max = 2000
  }
  let sprites = stopTimeGame.add.spriteBatch()
  stars = []
  for (let i = 0; i < max; i++) {
    xx[i] = Math.floor(Math.random() * 800) - 400
    yy[i] = Math.floor(Math.random() * 600) - 300
    zz[i] = Math.floor(Math.random() * 1700) - 100
    let star = stopTimeGame.make.sprite(0, 0, 'star')
    star.anchor.set(0.5)
    sprites.addChild(star)
    stars.push(star)
  }
}

function showTimeDestinationText (random_number) {
  text = stopTimeGame.add.bitmapText(stopTimeGame.world.centerX - iWidth * 0.20, iHeight * 0.06,
    'desyrel-pink', 'Traf w: ' + random_number + ' sekund', 80)
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

function addAvatars (number){
  switch (number) {
    case 2:
      player1 = stopTimeGame.add.sprite(iWidth * 0.37, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.56, iHeight * 0.57, 'avatar2')
      break
    case 3:
      player1 = stopTimeGame.add.sprite(iWidth * 0.28, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.46, iHeight * 0.57, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.63, iHeight * 0.57, 'avatar3')
      break
    case 4:
      player1 = stopTimeGame.add.sprite(iWidth * 0.19, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.37, iHeight * 0.57, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.54, iHeight * 0.57, 'avatar3')
      player4 = stopTimeGame.add.sprite(iWidth * 0.72, iHeight * 0.57, 'avatar4')
      break
    case 5:
      player1 = stopTimeGame.add.sprite(iWidth * 0.13, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.30, iHeight * 0.57, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.47, iHeight * 0.57, 'avatar3')
      player4 = stopTimeGame.add.sprite(iWidth * 0.65, iHeight * 0.57, 'avatar4')
      player5 = stopTimeGame.add.sprite(iWidth * 0.81, iHeight * 0.57, 'avatar5')
      break
    case 6:
      player1 = stopTimeGame.add.sprite(iWidth * 0.05, iHeight * 0.57, 'avatar1')
      player2 = stopTimeGame.add.sprite(iWidth * 0.22, iHeight * 0.57, 'avatar2')
      player3 = stopTimeGame.add.sprite(iWidth * 0.39, iHeight * 0.57, 'avatar3')
      player4 = stopTimeGame.add.sprite(iWidth * 0.56, iHeight * 0.57, 'avatar4')
      player5 = stopTimeGame.add.sprite(iWidth * 0.73, iHeight * 0.57, 'avatar5')
      player6 = stopTimeGame.add.sprite(iWidth * 0.90, iHeight * 0.57, 'avatar6')

  }
}




