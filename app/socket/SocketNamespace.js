const IoContainer = require('./IoContainer');

class SocketNamespace {

    constructor(roomId){
        this.io = IoContainer.getIO();
        this.roomId = roomId;

        this.namespace = this.createNewNamespace(roomId);
        console.log(`New socket namespace: [/${this.roomId}]`);
        this.addConnectAndDisconnectEvents();
    }

    createNewNamespace(roomId) {
        return this.io.of('/' + roomId); //SOCKET API
    }

    addConnectAndDisconnectEvents() {
        let roomId = this.roomId;

        this.namespace.on('connection', function (socket) {
            console.log(`Socket namespace id[${roomId}]: client connected`);

            socket.on('disconnect', function () {
                console.log(`Socket namespace id[${roomId}]: client disconnected`);
            });
        });
    }

//    namespace = io.of('/' + roomId);
//     namespace.on('connection', function (socket) {
//         console.log("Socket namespace: client connected. Room id: " + roomId);
//
//         socket.on('disconnect', function () {
//             console.log("Socket namespace: client disconnected. Room id: " + roomId);
//         });
//     });
}

module.exports = SocketNamespace;
