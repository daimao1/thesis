var Client = {};
Client.socket = io.connect(); // By default to localhost?

Client.sendTest = function () {
    console.log("test send");
    Client.socket.emit('test');
};

Client.askNewPlayer = function () {
    console.log("test askNewPlayer");
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer', function (data) {
    console.log("test newplayer");
    Game.addNewPlayer(data.id);
});
//odbiera socketa od server.js o nazwie allplayers
Client.socket.on('allplayers', function (data) {
    for (var i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id);
    }
});

Client.socket.on('remove_droid', function (id) {
    Game.removePlayer(id);
});