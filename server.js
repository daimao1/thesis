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

app.use('/login', function (req, res) {

    if (req.method.toLowerCase() == 'get') {
        res.sendFile(__dirname + '/html/login.html');
    } else if (req.method.toLowerCase() == 'post') {
        handleLoginForm(req, res);
    }
});

app.get('/stoptimegame', function (req, res) {
    res.sendFile(__dirname + '/html/stoptimegame.html');
});

app.use(function (req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    //res.send(404, 'Strony nie znaleziono'); //deprecated
    res.status(404).send('Strony nie znaleziono');
});

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on *: ' + server.address().port);
});

//login form handling
var formidable = require("formidable");
var util = require('util');

function handleLoginForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

        var user = {
            name: fields.name,
            password: fields.password
        };
        database.addNewUser(user);
        //TODO Store the data from the fields in your data store.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));
    });
}

server.lastPlayerID = 1; //TODO musi być osobna lista graczy dla każdego pokoju
server.lastRoomID = 1;
server.playersList = [];

//połączenie
io.on('connection', function (socket) {
    console.log('Socket connection on.');
    socket.on('new_room', function () {
        console.log('New game room created, id: ' + server.lastRoomID);
        socket.room = {
            id: server.lastRoomID++
        };
        //socket.emit('allplayers', getAllPlayers()); //wysłanie do przeglądarki akutalnej listy graczy
        socket.broadcast.emit('new_room', socket.player); //powiadomienie wszystkich włączonych przeglądarek o nowym pokoju

        //rozłączenie
        socket.on('disconnect', function () {
            console.log('Browser with room id: ' + socket.client.id + ' disconnected. Room closed.');
            io.emit('remove_room', socket.room.id);
        });
    });

    socket.on('test', function () {
        console.log('***Test received***');
    });

    socket.on('new_droid', function () {  //łączy się z androidem
        console.log('New android device connected, id = ' + server.lastPlayerID);
        socket.player = {
            id: server.lastPlayerID++
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