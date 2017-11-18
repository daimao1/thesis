let Board = {}
let roomId = document.head.id
let map

//pole START ma współrzędne grids[0][0], grids[0][1]; Pole META ma współrzędne grids[288][0], grids[288][1]
let grids = [[120, 3929.94], [248, 3929.94], [398, 3929.94], [540, 3929.94], [682, 3929.94], [824, 3929.94], [972, 3929.94], [1117, 3929.94],
  [1264, 3929.94], [1406, 3929.94], [1406, 3779.94], [1406, 3634.94], [1406, 3494.94], [1272, 3494.94], [1127, 3494.94], [1127, 3634.94],
  [982, 3634.94], [837, 3634.94], [837, 3494.94], [692, 3494.94], [548, 3494.94], [404, 3494.94], [260, 3494.94], [116, 3494.94],
  [116, 3350.94], [116, 3220.94], [116, 3092.94], [116, 2952.94], [116, 2805.94], [116, 2665.94], [116, 2517.94], [116, 2374.94],
  [260, 2374.94], [404, 2374.94], [548, 2374.94], [548, 2514.94], [548, 2654.94], [404, 2657.94], [404, 2805.94], [404, 2948.94],
  [550, 2948.94], [550, 3092.94], [550, 3236.94], [694, 3236.94], [842, 3236.94], [984, 3236.94], [1130, 3236.94], [1274, 3236.94],
  [1274, 3096.94], [1274, 2952.94], [1274, 2808.94], [1274, 2664.94], [1130, 2664.94], [986, 2664.94], [842, 2664.94], [842, 2518.94],
  [842, 2378.94], [842, 2234.94], [842, 2090.94], [986, 2090.94], [1130, 2090.94], [1274, 2090.94], [1274, 2230.94], [1274, 2374.94],
  [1418, 2374.94], [1562, 2374.94], [1562, 2230.94], [1562, 2085.94], [1706, 2085.94], [1850, 2085.94], [1850, 2230.94], [1850, 2375.94],
  [1850, 2520.94], [1850, 2662.94], [1850, 2804.94], [1995, 2804.94], [2136, 2804.94], [2136, 2659.94], [2136, 2514.94], [2136, 2374.94],
  [2136, 2230.94], [2136, 2085.94], [2136, 1940.94], [2136, 1798.94], [2280, 1798.94], [2424, 1798.94], [2424, 1943.94], [2424, 2088.94],
  [2424, 2228.94], [2424, 2370.94], [2424, 2515.94], [2568, 2515.94], [2568, 2660.94], [2568, 2805.94], [2424, 2805.94], [2424, 2949.94],
  [2424, 3094.94], [2280, 3094.94], [2135, 3094.94], [2135, 3236.94], [1991, 3236.94], [1846, 3236.94], [1846, 3384.94], [1846, 3526.94],
  [1846, 3670.94], [1990, 3670.94], [2134, 3670.94], [2134, 3814.94], [2278, 3814.94], [2428, 3814.94], [2566, 3814.94], [2712, 3814.94],
  [2856, 3814.94], [2856, 3672.94], [2856, 3530.94], [2856, 3382.94], [2856, 3240.94], [2856, 3098.94], [2856, 2950.94], [2856, 2808.94],
  [3000, 2808.94], [3144, 2808.94], [3144, 2950.94], [3144, 3092.94], [3288, 3092.94], [3432, 3092.94], [3432, 3234.94], [3432, 3380.94],
  [3288, 3380.94], [3144, 3380.94], [3144, 3526.94], [3144, 3670.94], [3288, 3670.94], [3432, 3670.94], [3576, 3670.94], [3720, 3670.94],
  [3864, 3670.94], [3864, 3528.94], [3864, 3386.94], [3864, 3240.94], [3864, 3096.94], [3864, 2954.94], [3864, 2806.94], [3864, 2662.94],
  [3720, 2662.94], [3576, 2662.94], [3434, 2662.94], [3434, 2516.94], [3434, 2374.94], [3578, 2374.94], [3722, 2374.94], [3866, 2374.94],
  [4010, 2374.94], [4010, 2232.94], [4010, 2086.94], [3866, 2086.94], [3722, 2086.94], [3576, 2086.94], [3434, 2086.94], [3290, 2086.94],
  [3146, 2086.94], [3002, 2086.94], [3002, 1940.94], [3002, 1798.94], [3002, 1652.94], [3002, 1510.94], [3002, 1364.94], [2858, 1364.94],
  [2714, 1364.94], [2570, 1364.94], [2426, 1364.94], [2282, 1364.94], [2138, 1364.94], [2138, 1222.94], [2138, 1076.94], [1994, 1076.94],
  [1850, 1076.94], [1706, 1076.94], [1706, 1218.94], [1706, 1364.94], [1706, 1508.94], [1562, 1508.94], [1418, 1508.94], [1274, 1508.94],
  [1274, 1654.94], [1274, 1796.94], [1130, 1796.94], [986, 1796.94], [986, 1654.94], [986, 1508.94], [842, 1508.94], [698, 1508.94],
  [554, 1508.94], [410, 1508.94], [266, 1508.94], [266, 1366.94], [266, 1220.94], [122, 1220.94], [122, 1078.94], [122, 932.94],
  [122, 786.94], [266, 786.94], [410, 786.94], [554, 786.94], [554, 934.94], [554, 1076.94], [554, 1222.94], [698, 1222.94],
  [842, 1222.94], [986, 1222.94], [986, 1080.94], [986, 934.94], [986, 790.94], [986, 644.94], [986, 500.94], [842, 500.94],
  [698, 500.94], [554, 500.94], [554, 356.94], [554, 212.94], [554, 68.94], [698, 68.94], [842, 68.94], [986, 68.94],
  [1130, 68.94], [1274, 68.94], [1418, 68.94], [1562, 68.94], [1706, 68.94], [1850, 68.94], [1994, 68.94], [2138, 68.94],
  [2138, 212.94], [2138, 356.94], [2282, 356.94], [2426, 356.94], [2426, 212.94], [2570, 212.94], [2714, 212.94], [2714, 356.94],
  [2858, 356.94], [3002, 356.94], [3002, 500.94], [3002, 644.94], [2858, 644.94], [2714, 644.94], [2570, 644.94], [2426, 644.94],
  [2426, 788.94], [2426, 932.94], [2570, 932.94], [2714, 932.94], [2858, 932.94], [3002, 932.94], [3146, 932.94], [3290, 932.94],
  [3290, 1076.94], [3434, 1076.94], [3578, 1076.94], [3578, 1220.94], [3578, 1364.94], [3434, 1364.94], [3290, 1364.94], [3290, 1508.94],
  [3290, 1652.94], [3290, 1796.94], [3434, 1796.94], [3578, 1796.94], [3722, 1796.94], [3866, 1796.94], [3866, 1652.94], [3866, 1508.94],
  [3866, 1364.94], [3866, 1220.94], [3866, 1076.94], [3866, 932.94], [3866, 788.94], [3866, 644.94], [3722, 644.94], [3578, 644.94],
  [3434, 644.94], [3434, 500.94], [3434, 356.94], [3434, 212.94], [3434, 68.94], [3578, 68.94], [3722, 68.94], [3866, 68.94],
  [4010, 68.94]]

let players = []
let currentPlayer
let iHeight = window.innerHeight
let iWidth = window.innerWidth
let mapBackground
let socket
let tween
let turnMessage, diceMessage
let background_sound, effect_special

let numberOfPlayers
let player1, player2, player3, player4, player5, player6
let allPlayers=[]

Board.preload = function () {
  board.load.image('plansza', '../assets/map/plansza.png') //załaduj planszę
  board.load.image('background', '../assets/map/wood_background.png')
  board.load.spritesheet('avatar1', '../assets/sprites/avatar1.png') //załaduj awatary
  board.load.spritesheet('avatar2', '../assets/sprites/avatar2.png')
  board.load.spritesheet('avatar3', '../assets/sprites/avatar3.png')
  board.load.spritesheet('avatar4', '../assets/sprites/avatar4.png')
  board.load.spritesheet('avatar5', '../assets/sprites/avatar5.png')
  board.load.spritesheet('avatar6', '../assets/sprites/avatar6.png')//dupa123
  board.load.bitmapFont('desyrel', '../assets/fonts/bitmapFonts/desyrel.png', '../assets/fonts/bitmapFonts/desyrel.xml')
  board.load.bitmapFont('desyrel-pink', '../assets/fonts/bitmapFonts/desyrel-pink.png', '../assets/fonts/bitmapFonts/desyrel-pink.xml')

  board.load.audio('background_sound', '../assets/audio/background_sound.mp3')
  board.load.audio('effect_special', '../assets/audio/effect_special.wav')

  socket = io.connect('/' + roomId)
  socket.emit('markGame', showMarkGame())
  setEventHandlers()
}

Board.create = function () {
  //board.stage.disableVisibilityChange = true; //gra działa gdy okno przeglądarki jest nieaktywne

  effect_special = board.add.audio('effect_special')
  effect_special.volume = 0.2
  mapBackground = board.add.tileSprite(0, 0, 4573 * 0.9, 4605 * 0.9, 'background')
  board.world.setBounds(0, 0, 4573 * 0.9, 4605 * 0.9)
  map = board.add.image(4573 * 0.9, 4605 * 0.9, 'plansza')
  map.anchor.setTo(1, 1) //położenie lewej górnej krawędzi obrazka
  map.scale.setTo(0.9)
  board.physics.startSystem(Phaser.Physics.P2JS)
  addPlayersToBoard(numberOfPlayers)
  socket.emit('gameReady')
}

function showMarkGame () {
  console.log('Wysłano socket markGame na serwer.')
}

Board.update = function () {

}

Board.render = function () {

}

let setEventHandlers = function () {
  socket.on('playerDice', movePlayer)
  socket.on('playersInfo', receivePlayersInfo)
  socket.on('nextPlayerTurn', receiveNextPlayerTurn)
}


function addPlayersToBoard (number) {
  let resume = false
  for(let i=0; i<allPlayers.length; i++){
    if(allPlayers[i].field > 0){
     resume = true
      break
    }
  }

  if(resume === false) {
    switch (number) {
      case 6:
        player6 = board.add.sprite(grids[0][0] + 70, grids[0][1] + 47, 'avatar6')
        player6.fieldNumber = 0
        board.physics.p2.enable(player6)
        player6.body.clearCollision()
      case 5:
        player5 = board.add.sprite(grids[0][0] + 35, grids[0][1] + 47, 'avatar5')
        player5.fieldNumber = 0
        board.physics.p2.enable(player5)
        player5.body.clearCollision()
      case 4:
        player4 = board.add.sprite(grids[0][0], grids[0][1] + 47, 'avatar4')
        player4.fieldNumber = 0
        board.physics.p2.enable(player4)
        player4.body.clearCollision()
      case 3:
        player3 = board.add.sprite(grids[0][0] + 70, grids[0][1], 'avatar3')
        player3.fieldNumber = 0
        board.physics.p2.enable(player3)
        player3.body.clearCollision()
      case 2:
        player2 = board.add.sprite(grids[0][0] + 35, grids[0][1], 'avatar2')
        player2.fieldNumber = 0
        board.physics.p2.enable(player2)
        player2.body.clearCollision()
      case 1:
        player1 = board.add.sprite(grids[0][0], grids[0][1], 'avatar1')
        player1.fieldNumber = 0
        board.physics.p2.enable(player1)
        player1.body.clearCollision()
    }
  }
  else{
    let returnedField
    switch (number) {
      case 6:
        returnedField = allPlayers[allPlayers[5]].field
        player6 = board.add.sprite(grids[returnedField][0] + 70, grids[returnedField][1] + 47, 'avatar6')
        player6.fieldNumber = returnedField
        board.physics.p2.enable(player6)
        player6.body.clearCollision()
      case 5:
        returnedField = allPlayers[allPlayers[4]].field
        player5 = board.add.sprite(grids[returnedField][0] + 35, grids[returnedField][1] + 47, 'avatar5')
        player5.fieldNumber = returnedField
        board.physics.p2.enable(player5)
        player5.body.clearCollision()
      case 4:
        returnedField = allPlayers[allPlayers[3]].field
        player4 = board.add.sprite(grids[returnedField][0], grids[returnedField][1] + 47, 'avatar4')
        player4.fieldNumber = returnedField
        board.physics.p2.enable(player4)
        player4.body.clearCollision()
      case 3:
        returnedField = allPlayers[allPlayers[2]].field
        player3 = board.add.sprite(grids[returnedField][0] + 70, grids[returnedField][1], 'avatar3')
        player3.fieldNumber = returnedField
        board.physics.p2.enable(player3)
        player3.body.clearCollision()
      case 2:
        returnedField = allPlayers[allPlayers[1]].field
        player2 = board.add.sprite(grids[returnedField][0] + 35, grids[returnedField][1], 'avatar2')
        player2.fieldNumber = returnedField
        board.physics.p2.enable(player2)
        player2.body.clearCollision()
      case 1:
        returnedField = allPlayers[allPlayers[0]].field
        player1 = board.add.sprite(grids[returnedField][0], grids[returnedField][1], 'avatar1')
        player1.fieldNumber = returnedField
        board.physics.p2.enable(player1)
        player1.body.clearCollision()
    }
  }
}


//TODO naprawić ruch pozostałych graczy - przesunięcie tak, aby awatary się nie pokrywały
function movePlayer (diceValue) {
  currentPlayer.value = diceValue
  currentPlayer.name = allPlayers[currentPlayer.id].name
  console.log('Odebrano socketa z serwera. Id ' + currentPlayer.id + ' ilośc wyrzuconych oczek: ' + currentPlayer.value)
  tween = board.add.tween(currentPlayer.body)
  let destination = +currentPlayer.fieldNumber + +diceValue
  if (destination >= 288)
    destination = 288
  console.log('Ruszysz się na pole nr: ' + destination)
  showTurnAndDice()
  let shiftX, shiftY
  switch(currentPlayer.id){
    case 0:
      shiftX = 0
      shiftY = 0
      break
    case 1:
      shiftX = 35
      shiftY = 0
      break
    case 2:
      shiftX = 70
      shiftY = 0
      break
    case 3:
      shiftX = 0
      shiftY = 47
      break
    case 4:
      shiftX = 35
      shiftY = 47
      break
    case 5:
      shiftX = 70
      shiftY = 47
      break
  }

  for (let i = currentPlayer.fieldNumber; i <= destination; i++) {
    tween.to({
      x: grids[i][0]+shiftX,
      y: grids[i][1]+shiftY
    }, 800)
    effect_special.play()
  }
  tween.start()
  showTurn(currentPlayer.name)
  currentPlayer.fieldNumber = destination
  tween.onComplete.add(afterPlayerMove, this)
  console.log('Player id:' + currentPlayer.id + ' fieldNumber: ' + currentPlayer.fieldNumber)
}
function afterPlayerMove(){
  console.log('Gracz zakończył ruch')

  isPlayerOnSpecialGrid(currentPlayer)
  turnMessage.destroy()
  setTimeout(function(){
    socket.emit('endPlayerTurn',currentPlayer.id, currentPlayer.fieldNumber)
  },3000)

  console.log('Wysłano socket endPlayerTurn do serwera')
}

function receivePlayersInfo (playersInfo) {
  console.log('Odebrano socket playersInfo')

  allPlayers = playersInfo
  allPlayers.forEach((player) => console.log('PlayerName: ' +
    player.name + ' PlayerInRoomId ' + player.id + ' playerField' + player.field))
  console.log('ile wszystkich graczy w pokoju: ' + allPlayers.length)
  numberOfPlayers = allPlayers.length
}

function receiveNextPlayerTurn (id) {
  console.log('Odebrano socket nextPlayerTurn')
  console.log('ID: '+id)

  switch (id) {
    case 0:
      setCurrentPlayer(player1);
      break
    case 1:
      setCurrentPlayer(player2);
      break
    case 2:
      setCurrentPlayer(player3);
      break
    case 3:
      setCurrentPlayer(player4);
      break
    case 4:
      setCurrentPlayer(player5);
      break
    case 5:
  }
  currentPlayer.id = id
  currentPlayer.name = allPlayers[currentPlayer.id].name
  showTurn(currentPlayer.name);
  console.log('Ustawiono aktualnego gracza: ' + currentPlayer)
}

function setCurrentPlayer(player){
  currentPlayer = player
    board.camera.follow(player)
    if(diceMessage !== undefined) {
      diceMessage.destroy()
    }
}

function isPlayerOnSpecialGrid (currentPlayer) {
  switch (currentPlayer.fieldNumber) {
    case 6:
    case 27:
    case 50:
    case 73:
    case 145:
    case 186:
    case 247:
    case 248:
      console.log('Znajdujesz się na polu CZERWONYM: ')
      goThreeFieldsBack()
      break
    case 13:
    case 60:
    case 109:
    case 146:
    case 166:
    case 230:
    case 272:
      console.log('Znajdujesz się na polu ZIELONYM')
      goThreeFieldsForward()
      break
    case 9:
    case 100:
    case 200:
    case 257:
    case 287:
      console.log('Znajdujesz się na polu ZAMEK')
      socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'castle'})
      break
    case 22:
    case 89:
    case 161:
    case 240:
    case 286:
      console.log('Znajdujesz się na polu STADION')
      socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'stadium'})
      break
    case 31:
    case 71:
      console.log('Znajdujesz się na polu WYZWANIE 4')
      socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'challenge4'})
      break
    case 44:
    case 118:
    case 174:
      console.log('Znajdujesz się na polu WYZWANIE 5')
      socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'challenge5'})
      break
    case 224:
    case 283:
      console.log('Znajdujesz się na polu WYZWANIE 6')
      socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'challenge6'})
      break
    case 53:
    case 133:
    case 205:
    case 264:
      console.log('Znajdujesz się na polu RATUSZ')
      socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'townHall'})
      break
    case 36:
    case 82:
    case 191:
    case 215:
    case 271:
      console.log('Znajdujesz się na polu QUIZ 1 NA WSZYSTKICH')
      socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'oneVsAll'})
      break
    case 288:
      makeWinner()
      break
  }

}

function goThreeFieldsBack () {
  tween = board.add.tween(currentPlayer.body)
  let k = 1
  for (let j = 0; j < 3; j++) {
    tween.to({
      x: grids[currentPlayer.fieldNumber - k][0],
      y: grids[currentPlayer.fieldNumber - k][1]
    }, 800)
    k++

  }
  tween.start()
  currentPlayer.fieldNumber = currentPlayer.fieldNumber - 3
  console.log('Player 1: fieldNumber: ' + currentPlayer.fieldNumber)
}

function goThreeFieldsForward () {
  tween = board.add.tween(currentPlayer.body)
  let m = 1
  for (let j = 0; j < 3; j++) {
    tween.to({
      x: grids[currentPlayer.fieldNumber + m][0],
      y: grids[currentPlayer.fieldNumber + m][1]
    }, 800)
    m++
  }
  tween.start()
  currentPlayer.fieldNumber = currentPlayer.fieldNumber - 3
  console.log('Player 1: fieldNumber: ' + currentPlayer.fieldNumber)
}

function makeWinner () {
  console.log('Wygrałeś')
}

function showTurnAndDice () {
  showTurn()
  showDice()
}

function showTurn (playerName) {
  if (typeof turnMessage !== 'undefined') {
    turnMessage.destroy()
  }
  turnMessage = board.add.bitmapText(1, 1, 'desyrel', 'Gracz:  ' + playerName, 64)
  turnMessage.fontSize = 55
  turnMessage.fixedToCamera = true
  turnMessage.cameraOffset.setTo(iWidth / 7, iHeight / 1.2)
}

function showDice () {
  if (typeof diceMessage !== 'undefined') {
    diceMessage.destroy()
  }
  diceMessage = board.add.bitmapText(1, 1, 'desyrel-pink', 'Kostka:  ' + currentPlayer.value, 64)
  diceMessage.fontSize = 55
  diceMessage.fixedToCamera = true
  diceMessage.cameraOffset.setTo(iWidth / 1.7, iHeight / 1.2)
}
