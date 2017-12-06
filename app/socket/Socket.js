const IoContainer = require('./IoContainer');

module.exports = function (io) {

    IoContainer.setIO(io);

    //on each connection
    io.on('connection', function (socket) {
        console.log(`SocketIO: client connected: socket.id = [${socket.id}]`);

        socket.on('disconnect', function () {
            console.log(`SocketIO: client disconnected: socket.id = [${socket.id}]`);
        });
    });
};