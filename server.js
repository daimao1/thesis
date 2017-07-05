var express = require('express');
var app = express();
var server = require('http').Server(app);
const database = require('./database');

var io = require('socket.io').listen(server);

//resources
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

database.constructor(); // uruchamiam bazę danych

//routes
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});

app.get('/stoptimegame', function (req, res) {
    res.sendFile(__dirname + '/html/stoptimegame.html');
});

app.use(function (req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Strony nie znaleziono');
});

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on *: ' + server.address().port);
});

server.lastPlayerID = 1;
server.browserID = 1;
server.playersList = [];

//połączenie
io.on('connection', function (socket) {
    //console.log('Dodanie nowego gracza (przeglądarka) nr '+server.lastPlayerID);
    // socket.on('newplayer', function () {
    //     console.log('New browser, id: ' + server.lastPlayerID);
    //     socket.player = {
    //         id: server.lastPlayerID++,
    //     };
    //     socket.emit('allplayers', getAllPlayers());
    //     socket.broadcast.emit('newplayer', socket.player);
    //
    //     //rozłączenie
    //     socket.on('disconnect', function () {
    //         console.log('Player ' + socket.player.id + " disconnected.");
    //         io.emit('remove', socket.player.id);
    //     });
    // });

    socket.on('test', function () {
        console.log('test received');
    });

    socket.on('new_droid', function () {//odbiera socketa od androida
        console.log('New android device connected, id = ' + server.lastPlayerID)

        socket.player = {
            id: server.lastPlayerID++,
        };
        socket.emit('allplayers', getAllPlayers()); //wysyła socketa do funkcji allplayers
        socket.broadcast.emit('newplayer', socket.player);

        //rozłączenie
        socket.on('disconnect', function () {
            console.log('Deleted android device id: ' + socket.player.id);
            server.lastPlayerID--;
            io.emit('remove_player', socket.player.id);
        });
    });

    socket.on('stopButton', function () {
        //console.log('odebrano socketa z androida');
        io.emit('stoptime', socket.player.id);
    })
});


function getAllPlayers() {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}
//losowanie - obecnie niewykorzystywane
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}