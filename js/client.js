var Client = {};
Client.socket = io.connect(); // By default to localhost?

Client.sendTest = function () {
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function () {
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer', function (data) {
    Game.addNewPlayer(data.id);
});

Client.socket.on('allplayers', function (data) {
    for (var i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id);
    }
});

Client.socket.on('remove', function (id) {
    Game.removePlayer(id);
});