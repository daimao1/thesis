const IoContainer = require('./IoContainer');

const PlayerService = require('../player/PlayerService');
const RoomService = require('../room/RoomService');

class SocketNamespace {

    constructor(roomId){
        this.io = IoContainer.getIO();
        this.roomId = roomId;
        this.namespace = this.createNewNamespace(roomId);
        console.log(`SocketIO/N: New socket namespace: [/${this.roomId}]`);

        this.initSocketConnectionHandler();
    }

    createNewNamespace(roomId) {
        return this.io.of('/' + roomId);
    }

    initSocketConnectionHandler() {
        const roomId = this.roomId;

        if (this.namespace === undefined){
            throw new Error('SocketIO/N: Namespace undefined');
        }

        this.namespace.on('connection', (socket) => {
            console.log(`SocketIO/N: Socket namespace id[${roomId}]: new client connected: socket.id = [${socket.id}]`);

            RoomService.addPlayerToRoom(PlayerService.newPlayer(roomId, socket));

            socket.on('disconnect', function () {
                console.log(`SocketIO/N: Socket namespace id[${roomId}]: client disconnected: socket.id = [${socket.id}]`);
                RoomService.removeAllPlayers(roomId); //TODO nie usuwać wszystkich
            });
        });
    }
}

module.exports = SocketNamespace;
