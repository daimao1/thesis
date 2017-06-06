var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

const database = require('./database');


//resources
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

database.constructor(); // uruchamiam bazę danych


app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;
server.playersList = [];

server.listen(process.env.PORT || 8081,function(){
    console.log('Nasłuchiwanie portu '+server.address().port);
});

//połączenie
io.on('connection',function(socket){
    //console.log('Dodanie nowego gracza (przeglądarka) nr '+server.lastPlayderID);
    socket.on('newplayer',function(){
        console.log('Dodanie nowego gracza (przeglądarka) nr ' + server.lastPlayderID);
        socket.player = {
            id: server.lastPlayderID++,
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        //rozłączenie
        socket.on('disconnect',function(){
            console.log('Usunięto gracza nr '+socket.player.id);
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });

    socket.on('new_droid', function () {
        console.log('New android device connected, id = ' + server.player.id)
        socket.player = {
            id: server.lastPlayderID++,
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('new_droid',socket.player);

        //rozłączenie
        socket.on('disconnect',function(){
            console.log('Usunięto gracza nr '+socket.player.id);
            io.emit('remove_droid',socket.player.id);
        });
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}
//losowanie - obecnie niewykorzystywane
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
