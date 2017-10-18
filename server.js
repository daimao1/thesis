var express = require('express')
var app = express()
var server = require('http').Server(app)
var morgan = require('morgan')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var passport = require('passport')
var flash = require('connect-flash')
var io = require('socket.io').listen(server)

//resources TODO nie wiadomo czy nam to potrzebne
app.use('/css', express.static(__dirname + '/css'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/assets', express.static(__dirname + '/assets'))

app.use(express.static(__dirname + '/views'))

app.use(morgan('dev')) //log every request to the console

app.set('view engine', 'ejs') // set up ejs for templating

app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// required for passport
// require('./app/config/passport')(passport)
// app.use(session({
//   secret: 'vidyapathaisalwaysrunning',
//   resave: true,
//   saveUninitialized: true
// })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport) //ROUTING

server.listen(process.env.PORT || 8081, function () {
  console.log('Listening on *: ' + server.address().port)
})

server.lastPlayerID = 1 //TODO musi być osobna lista graczy dla każdego pokoju
server.lastRoomID = 1
server.playersList = []
//połączenie
io.on('connection', function (socket) {

  console.log('Socket connection on.')
  socket.on('new_room', function () {
    console.log('New game room created, id: ' + server.lastRoomID)
    socket.room = {
      id: server.lastRoomID++
    }
    //socket.emit('allplayers', getAllPlayers()); //wysłanie do przeglądarki akutalnej listy graczy
    socket.broadcast.emit('new_room', socket.player) //powiadomienie wszystkich włączonych przeglądarek o nowym pokoju

    //rozłączenie
    socket.on('disconnect', function () {
      console.log('Browser with room id: ' + socket.client.id + ' disconnected. Room closed.')
      io.emit('remove_room', socket.room.id)
    })
  })

  socket.on('test', function () {
    console.log('***Test received***')
  })

  socket.on('new_droid', function () {  //łączy się z androidem
    console.log('New android device connected, id = ' + server.lastPlayerID)
    socket.player = {
      id: server.lastPlayerID++
    }
    socket.emit('allplayers', getAllPlayers()) //wysyła socketa do funkcji allplayers
    socket.broadcast.emit('newplayer', socket.player)

    //rozłączenie
    socket.on('disconnect', function () {
      console.log('Deleted android device id: ' + socket.player.id)
      server.lastPlayerID--
      io.emit('remove_player', socket.player.id)
    })
  })

  socket.on('stopButton', function () {
    //console.log('odebrano socketa z androida');
    io.emit('stoptime', socket.player.id)
  })

  socket.on('diceValue', function (value) {
    console.log(socket.player.id + ': Odebrano wartość: ' + value)
    io.emit('playerDice', {id: socket.player.id, value: value})
  })

  socket.on('specialGrid', function (gridData) {
    console.log('Id aktualnego gracza: ' + gridData.id + ' Wartość pola specjalnego: ' + gridData.grid)
    io.emit('specialGrid', {id: gridData.id, grid: gridData.grid})
  })

})

function getAllPlayers () {
  var players = []
  Object.keys(io.sockets.connected).forEach(function (socketID) {
    var player = io.sockets.connected[socketID].player
    if (player) players.push(player)
  })
  return players
}

//losowanie - obecnie niewykorzystywane
function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}