let StopTimeGame = {}
let roomId = document.head.id

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

  socket = io.connect('/' + roomId)
  setHandlers()
  socket.emit('markStopTimeGame')
}

StopTimeGame.create = function () {
  iHeight = window.innerHeight
  iWidth = window.innerWidth

  generateBackgroundAnimation()
  goFullScreen()
  createButtons(numberOfPlayers)
  random_number = randomInt(5, 14)
  showTimeDestinationText(random_number)
  socket.emit('stopTimeGameReady')
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

function createButtons (numberOfPlayers) {
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
  }


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



