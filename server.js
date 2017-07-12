var express = require('express');
var app = express();
var server = require('http').Server(app);
var morgan = require('morgan');
const database = require('./config/dbconnection');
const dbcon = database.connection;

var io = require('socket.io').listen(server);

//resources TODO nie wiadomo czy nam to potrzebne
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.use(express.static(__dirname + '/views'));

app.use(morgan('dev')); //log every request to the console

app.set('view engine', 'ejs'); // set up ejs for templating

//database.constructor(); //uruchamiam bazę danych TODO działa bez tego, sprawdzic do czego to

//ROUTES
//Home page
app.get('/', function (req, res) {
    res.render('index.ejs'); // load the index.ejs file
    //res.sendFile(__dirname + '/views/index.html');
});
app.get('/', function (req, res) {
    res.render('index.ejs'); // load the index.ejs file
    //res.sendFile(__dirname + '/views/index.html');
});
app.get('/homepage', function (req, res) {
    res.render('homepage.ejs'); // load the index.ejs file
    //res.sendFile(__dirname + '/views/index.html');
});

//Login page
app.get('/login', function (req, res) {
    //res.sendFile(__dirname + '/views/login.html');
    res.render('login.ejs');
});
app.post('/login', function (req, res) {
    handleLoginForm(req, res);
});
//Stop-time minigame
app.get('/stoptimegame', function (req, res) {
    //res.sendFile(__dirname + '/views/stoptimegame.html');
    res.render('stoptimegame.ejs');
});
//404
app.use(function (req, res){
    res.setHeader('Content-Type', 'text/plain');
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
        //database.addNewUser(user); //TODO przenieść poniższą funkcję do pliku modelu user
        dbcon.query("INSERT INTO `users`(`username`, `password`) VALUES ('" + user.name + "', '" + user.password + "')", function (err) {
            if(!err) {
                console.log("User " + user.name + " has been successfully saved in database.");
            } else {
                console.log("Error while saving user in database: " + err.message);
            }
        });
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