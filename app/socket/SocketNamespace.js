const IoContainer = require('./IoContainer');
const PlayerService = require('../player/PlayerService');
//const RoomService = require('../room/RoomService');
const SocketEventService = require('./SocketEventService');

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

            const player = PlayerService.newPlayer(roomId, socket);

            SocketEventService.initBasicHandlers(player, this);
        });
    }
}

module.exports = SocketNamespace;
