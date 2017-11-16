//const SocketNamespace = require('./SocketNamespace');
const IoContainer = require('./IoContainer');

module.exports = function (io) {

    //only connection with /nsp
    // const nsp = io.of('/nsp');
    // nsp.on('connection', function (socket) {
    //     console.log("Socket nsp: client connected.");
    //
    //     socket.on('disconnect', function () {
    //         console.log("Socket nsp: client disconnected");
    //     });
    // });
    //
    // nspGenerator.createNew(io, 55);

    //const nsp = new SocketNamespace(io, 55);
    IoContainer.setIO(io);


    //problably each connection
    io.on('connection', function (socket) {
        console.log(`SocketIO: client connected: socket.id = [${socket.id}]`);
        //Object.keys(socket).forEach(function(data)
        //{ console.log(Object.keys(data) + ' : ' + Object.values(data)); });
        socket.on('disconnect', function () {
            console.log(`SocketIO: client disconnected: socket.id = [${socket.id}]`);
        });
    });
};