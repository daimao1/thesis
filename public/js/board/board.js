let Board = {}
let roomId = document.head.id
let map

let grids = [[120, 3929], [248, 3929], [398, 3929], [540, 3929], [682, 3929], [824, 3929], [972, 3929], [1117, 3929],
  [1264, 3929], [1406, 3929], [1406, 3779], [1406, 3634], [1406, 3494], [1272, 3494], [1127, 3494], [1127, 3634],
  [982, 3634], [837, 3634], [837, 3494], [692, 3494], [548, 3494], [404, 3494], [260, 3494], [116, 3494],
  [116, 3350], [116, 3220], [116, 3092], [116, 2952], [116, 2805], [116, 2665], [116, 2517], [116, 2374],
  [260, 2374], [404, 2374], [548, 2374], [548, 2514], [548, 2654], [404, 2657], [404, 2805], [404, 2948],
  [550, 2948], [550, 3092], [550, 3236], [694, 3236], [842, 3236], [984, 3236], [1130, 3236], [1274, 3236],
  [1274, 3096], [1274, 2952], [1274, 2808], [1274, 2664], [1130, 2664], [986, 2664], [842, 2664], [842, 2518],
  [842, 2378], [842, 2234], [842, 2090], [986, 2090], [1130, 2090], [1274, 2090], [1274, 2230], [1274, 2374],
  [1418, 2374], [1562, 2374], [1562, 2230], [1562, 2085], [1706, 2085], [1850, 2085], [1850, 2230], [1850, 2375],
  [1850, 2520], [1850, 2662], [1850, 2804], [1995, 2804], [2136, 2804], [2136, 2659], [2136, 2514], [2136, 2374],
  [2136, 2230], [2136, 2085], [2136, 1940], [2136, 1798], [2280, 1798], [2424, 1798], [2424, 1943], [2424, 2088],
  [2424, 2228], [2424, 2370], [2424, 2515], [2568, 2515], [2568, 2660], [2568, 2805], [2424, 2805], [2424, 2949],
  [2424, 3094], [2280, 3094], [2135, 3094], [2135, 3236], [1991, 3236], [1846, 3236], [1846, 3384], [1846, 3526],
  [1846, 3670], [1990, 3670], [2134, 3670], [2134, 3814], [2278, 3814], [2428, 3814], [2566, 3814], [2712, 3814],
  [2856, 3814], [2856, 3672], [2856, 3530], [2856, 3382], [2856, 3240], [2856, 3098], [2856, 2950], [2856, 2808],
  [3000, 2808], [3144, 2808], [3144, 2950], [3144, 3092], [3288, 3092], [3432, 3092], [3432, 3234], [3432, 3380],
  [3288, 3380], [3144, 3380], [3144, 3526], [3144, 3670], [3288, 3670], [3432, 3670], [3576, 3670], [3720, 3670],
  [3864, 3670], [3864, 3528], [3864, 3386], [3864, 3240], [3864, 3096], [3864, 2954], [3864, 2806], [3864, 2662],
  [3720, 2662], [3576, 2662], [3434, 2662], [3434, 2516], [3434, 2374], [3578, 2374], [3722, 2374], [3866, 2374],
  [4010, 2374], [4010, 2232], [4010, 2086], [3866, 2086], [3722, 2086], [3576, 2086], [3434, 2086], [3290, 2086],
  [3146, 2086], [3002, 2086], [3002, 1940], [3002, 1798], [3002, 1652], [3002, 1510], [3002, 1364], [2858, 1364],
  [2714, 1364], [2570, 1364], [2426, 1364], [2282, 1364], [2138, 1364], [2138, 1222], [2138, 1076], [1994, 1076],
  [1850, 1076], [1706, 1076], [1706, 1218], [1706, 1364], [1706, 1508], [1562, 1508], [1418, 1508], [1274, 1508],
  [1274, 1654], [1274, 1796], [1130, 1796], [986, 1796], [986, 1654], [986, 1508], [842, 1508], [698, 1508],
  [554, 1508], [410, 1508], [266, 1508], [266, 1366], [266, 1220], [122, 1220], [122, 1078], [122, 932],
  [122, 786], [266, 786], [410, 786], [554, 786], [554, 934], [554, 1076], [554, 1222], [698, 1222],
  [842, 1222], [986, 1222], [986, 1080], [986, 934], [986, 790], [986, 644], [986, 500], [842, 500],
  [698, 500], [554, 500], [554, 356], [554, 212], [554, 68], [698, 68], [842, 68], [986, 68],
  [1130, 68], [1274, 68], [1418, 68], [1562, 68], [1706, 68], [1850, 68], [1994, 68], [2138, 68],
  [2138, 212], [2138, 356], [2282, 356], [2426, 356], [2426, 212], [2570, 212], [2714, 212], [2714, 356],
  [2858, 356], [3002, 356], [3002, 500], [3002, 644], [2858, 644], [2714, 644], [2570, 644], [2426, 644],
  [2426, 788], [2426, 932], [2570, 932], [2714, 932], [2858, 932], [3002, 932], [3146, 932], [3290, 932],
  [3290, 1076], [3434, 1076], [3578, 1076], [3578, 1220], [3578, 1364], [3434, 1364], [3290, 1364], [3290, 1508],
  [3290, 1652], [3290, 1796], [3434, 1796], [3578, 1796], [3722, 1796], [3866, 1796], [3866, 1652], [3866, 1508],
  [3866, 1364], [3866, 1220], [3866, 1076], [3866, 932], [3866, 788], [3866, 644], [3722, 644], [3578, 644],
  [3434, 644], [3434, 500], [3434, 356], [3434, 212], [3434, 68], [3578, 68], [3722, 68], [3866, 68],
  [4010, 68]]

let players = []
let currentPlayer
let iHeight = window.innerHeight
let iWidth = window.innerWidth
let mapBackground
let socket
let tween
let turnMessage, diceMessage, message
let background_sound, effect_special
let shiftX, shiftY
let difference

let numberOfPlayers
let player1, player2, player3, player4, player5, player6
let allPlayers = []


Board.preload = function () {
  board.load.image('plansza', '../../assets/map/plansza.png')
    board.load.image('background', '../../assets/map/wood_background.png')
  board.load.spritesheet('avatar1', '../../assets/sprites/avatar1.png')
    board.load.spritesheet('avatar2', '../../assets/sprites/avatar2.png')
    board.load.spritesheet('avatar3', '../../assets/sprites/avatar3.png')
    board.load.spritesheet('avatar4', '../../assets/sprites/avatar4.png')
    board.load.spritesheet('avatar5', '../../assets/sprites/avatar5.png')
    board.load.spritesheet('avatar6', '../../assets/sprites/avatar6.png')
    board.load.bitmapFont('desyrel', '../../assets/fonts/bitmapFonts/desyrel.png', '../../assets/fonts/bitmapFonts/desyrel.xml')
    board.load.bitmapFont('desyrel-pink', '../../assets/fonts/bitmapFonts/desyrel-pink.png', '../../assets/fonts/bitmapFonts/desyrel-pink.xml')

    board.load.audio('background_sound', '../../assets/audio/background_sound.mp3')
    board.load.audio('effect_special', '../../assets/audio/effect_special.wav')

    socket = io.connect('/' + roomId)
    socket.emit('markGame', showMarkGame())
    setEventHandlers()
}

Board.create = function () {
  board.stage.disableVisibilityChange = true

    effect_special = board.add.audio('effect_special')
    effect_special.volume = 0.2
    mapBackground = board.add.tileSprite(0, 0, 4573 * 0.9, 4605 * 0.9, 'background')
    board.world.setBounds(0, 0, 4573 * 0.9, 4605 * 0.9)
    map = board.add.image(4573 * 0.9, 4605 * 0.9, 'plansza')
  map.anchor.setTo(1, 1)
    map.scale.setTo(0.9)
    board.physics.startSystem(Phaser.Physics.P2JS)
    addPlayersToBoard(numberOfPlayers)
    socket.emit('gameReady')
}

function showMarkGame() {
    console.log('Wysłano socket markGame na serwer.')
}

let setEventHandlers = function () {
    socket.on('playerDice', movePlayer)
    socket.on('playersInfo', receivePlayersInfo)
    socket.on('nextPlayerTurn', receiveNextPlayerTurn)

    socket.on('endRound', receiveEndRound)
}

function receiveEndRound() {
    console.log('End round - waiting for redirect...');
    socket.once('redirect', function (url) {
        if(url.includes(roomId) && url.charAt(0) === '/'){
            console.log('Redirecting to: [ ' + url + ' ]... (2.5 seconds)');
            setTimeout( function () {
                window.location.href = url;
            }, 2.5 * 1000);
        } else {
            let reason = "incorrect url";
            console.log('Redirect rejected, reason: ' + reason);
            socket.emit('redirectRejected', reason);
        }
    });
}

function addPlayersToBoard(number) {
    let resume = false
    for (let i = 0; i < allPlayers.length; i++) {
        if (allPlayers[i].field > 0) {
            resume = true
            break
        }
    }

    if (resume === false) {
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
    else {
        let returnedField
        switch (number) {
          case 6:
            returnedField = allPlayers[5].field
            player6 = board.add.sprite(grids[returnedField][0] + 70, grids[returnedField][1] + 47, 'avatar6')
            player6.fieldNumber = returnedField
            board.physics.p2.enable(player6)
            player6.body.clearCollision()
          case 5:
            returnedField = allPlayers[4].field
            player5 = board.add.sprite(grids[returnedField][0] + 35, grids[returnedField][1] + 47, 'avatar5')
            player5.fieldNumber = returnedField
            board.physics.p2.enable(player5)
            player5.body.clearCollision()
          case 4:
            returnedField = allPlayers[3].field
            player4 = board.add.sprite(grids[returnedField][0], grids[returnedField][1] + 47, 'avatar4')
            player4.fieldNumber = returnedField
            board.physics.p2.enable(player4)
            player4.body.clearCollision()
          case 3:
            returnedField = allPlayers[2].field
            player3 = board.add.sprite(grids[returnedField][0] + 70, grids[returnedField][1], 'avatar3')
            player3.fieldNumber = returnedField
            board.physics.p2.enable(player3)
            player3.body.clearCollision()
          case 2:
            returnedField = allPlayers[1].field
            player2 = board.add.sprite(grids[returnedField][0] + 35, grids[returnedField][1], 'avatar2')
            player2.fieldNumber = returnedField
            board.physics.p2.enable(player2)
            player2.body.clearCollision()
          case 1:
            returnedField = allPlayers[0].field
            player1 = board.add.sprite(grids[returnedField][0], grids[returnedField][1], 'avatar1')
            player1.fieldNumber = returnedField
            board.physics.p2.enable(player1)
            player1.body.clearCollision()
        }
    }
}

function movePlayer(diceValue) {
    currentPlayer.value = diceValue
    currentPlayer.name = allPlayers[currentPlayer.id].name
    let destination = +currentPlayer.fieldNumber + +diceValue
    let newDestination = lookForChallenges(+currentPlayer.fieldNumber, destination)
    console.log('newDestination' + newDestination)
    difference = 0
    if (newDestination > -1) {
        difference = destination - newDestination
        destination = newDestination
        console.log('difference = ' + difference)
    }
    console.log('Ruszysz się na pole nr: ' + destination)
    showTurnAndDice()
    changePlayerPosition(destination)
    showTurn(currentPlayer.name)
    console.log('Player id:' + currentPlayer.id + ' fieldNumber: ' + currentPlayer.fieldNumber)
}

function changePlayerPosition(destination) {
  tween = board.add.tween(currentPlayer.body)
    console.log('Przesuwanie...');
    if (destination >= 288)
        destination = 288
    shiftPlayer()
    for (let i = currentPlayer.fieldNumber; i <= destination; i++) {
        tween.to({
            x: grids[i][0] + shiftX,
            y: grids[i][1] + shiftY
        }, 800)
        effect_special.play()
    }
    currentPlayer.fieldNumber = destination
    tween.start()
    tween.onComplete.add(afterPlayerMove, this)
}

function shiftPlayer() {
    switch (currentPlayer.id) {
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
}

function afterPlayerMove() {
    console.log('Gracz zakończył ruch')

    const isPlayerOnChallengeGrid = isPlayerOnSpecialGrid(currentPlayer)
    if (isPlayerOnChallengeGrid === false) {
        endPlayerTurn();
    }
}

function endPlayerTurn() {
    turnMessage.destroy()
    setTimeout(function () {
        socket.emit('endPlayerTurn', currentPlayer.id, currentPlayer.fieldNumber)
      if(message !== undefined)
      message.destroy()
    }, 3000)
    console.log('Wysłano socket endPlayerTurn do serwera')
}

function lookForChallenges(currentField, dest) {
    console.log('lookForChallenges')
    let challengeFields = [31, 71, 44, 118, 174, 224, 283]
    for (let field = currentField; field < dest; field++) {
        if (challengeFields.includes(field)) {
            return field
        }
    }
    return -1
}

function receivePlayersInfo(playersInfo) {
    console.log('Odebrano socket playersInfo')
    allPlayers = playersInfo
    allPlayers.forEach((player) => console.log('PlayerName: ' +
        player.name + ' PlayerInRoomId ' + player.id + ' playerField' + player.field))
    console.log('ile wszystkich graczy w pokoju: ' + allPlayers.length)
    numberOfPlayers = allPlayers.length
}

function receiveNextPlayerTurn(id) {
    console.log('Odebrano socket nextPlayerTurn')
    console.log('ID: ' + id)
    switch (id) {
        case 0:
            setCurrentPlayer(player1)
            break
        case 1:
            setCurrentPlayer(player2)
            break
        case 2:
            setCurrentPlayer(player3)
            break
        case 3:
            setCurrentPlayer(player4)
            break
        case 4:
            setCurrentPlayer(player5)
            break
        case 5:
    }
    currentPlayer.id = id
    currentPlayer.name = allPlayers[currentPlayer.id].name
    showTurn(currentPlayer.name)
    console.log('Ustawiono aktualnego gracza: ' + currentPlayer)
  if(message !== undefined)
    message.destroy()
}

function setCurrentPlayer(player) {
    currentPlayer = player
    board.camera.follow(player)
    if (diceMessage !== undefined) {
        diceMessage.destroy()
    }
}

function isPlayerOnSpecialGrid(currentPlayer) {
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
            showMessage('Wyrzuc 4 lub wiecej oczek aby przejsc dalej')
            socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'challenge4'})
            challengeHandler()
            return true;
            break
        case 44:
        case 118:
        case 174:
            console.log('Znajdujesz się na polu WYZWANIE 5')
            showMessage('Wyrzuc 5 lub wiecej oczek aby przejsc dalej')
            socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'challenge5'})
            challengeHandler()
            return true;
            break
        case 224:
        case 283:
            console.log('Znajdujesz się na polu WYZWANIE 6')
            showMessage('Wyrzuc 6 oczek aby przejsc dalej')
            socket.emit('specialGrid', {playerId: currentPlayer.id, gridName: 'challenge6'})
            challengeHandler()
            return true;
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
    return false;
}

function challengeHandler() {
    socket.once('challengeResult', function (isPassed, playerId) {
        if (playerId === currentPlayer.id) {
            if (isPassed && difference >= 0) {
                console.log('ChallengePass')
                if (difference === 0) {
                    difference = 1;
                }
                const dest = +currentPlayer.fieldNumber + +difference;
                changePlayerPosition(dest)
            } else {
                console.log('ChallengeNotPass')
                difference = 0;
              tween = board.add.tween(currentPlayer.body)
              tween.to({
                x: grids[currentPlayer.fieldNumber - 1][0] + shiftX,
                y: grids[currentPlayer.fieldNumber - 1][1] + shiftY
              }, 800)
              tween.start()
              currentPlayer.fieldNumber = currentPlayer.fieldNumber - 1
              console.log('Player '+currentPlayer.name+': fieldNumber: ' + currentPlayer.fieldNumber)
                endPlayerTurn();
            }
        }
    });
}

function goThreeFieldsBack() {
    tween = board.add.tween(currentPlayer.body)
    let k = 1
    for (let j = 0; j < 3; j++) {
        tween.to({
            x: grids[currentPlayer.fieldNumber - k][0] + shiftX,
            y: grids[currentPlayer.fieldNumber - k][1] + shiftY
        }, 800)
        k++
    }
    tween.start()
    currentPlayer.fieldNumber = currentPlayer.fieldNumber - 3
    console.log('Player '+currentPlayer.name+': fieldNumber: ' + currentPlayer.fieldNumber)
}

function goThreeFieldsForward() {
    tween = board.add.tween(currentPlayer.body)
    let m = 1
    for (let j = 0; j < 3; j++) {
        tween.to({
            x: grids[currentPlayer.fieldNumber + m][0] + shiftX,
            y: grids[currentPlayer.fieldNumber + m][1] + shiftY
        }, 800)
        m++
    }
    tween.start()
    currentPlayer.fieldNumber = currentPlayer.fieldNumber - 3
    console.log('Player 1: fieldNumber: ' + currentPlayer.fieldNumber)
}

function makeWinner() {
    console.log('Wygrałeś')
}

function showTurnAndDice() {
    showTurn()
    showDice()
}

function showTurn(playerName) {
    if (typeof turnMessage !== 'undefined') {
        turnMessage.destroy()
    }
    turnMessage = board.add.bitmapText(1, 1, 'desyrel', 'Gracz:  ' + playerName, 64)
    turnMessage.fontSize = 55
    turnMessage.fixedToCamera = true
    turnMessage.cameraOffset.setTo(iWidth / 7, iHeight / 1.2)
}

function showDice() {
    if (typeof diceMessage !== 'undefined') {
        diceMessage.destroy()
    }
    diceMessage = board.add.bitmapText(1, 1, 'desyrel-pink', 'Kostka:  ' + currentPlayer.value, 64)
    diceMessage.fontSize = 55
    diceMessage.fixedToCamera = true
    diceMessage.cameraOffset.setTo(iWidth / 1.7, iHeight / 1.2)
}

function showMessage(text_message) {
    message = board.add.bitmapText(1, 1, 'desyrel', text_message, 64)
    message.fontSize = 55
    message.fixedToCamera = true
    message.cameraOffset.setTo(iWidth / 7, iHeight / 4.5)
}