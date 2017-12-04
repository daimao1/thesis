const IoContainer = require('./IoContainer');
const SocketEventService = require('./SocketEventService');

class SocketNamespace {

    constructor(roomId){
        this.io = IoContainer.getIO();
        this.roomId = roomId;
        this.namespace = this.createNewNamespace(roomId);
        this.gameSocket = undefined;
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

            SocketEventService.initBasicHandlers(socket, this);
        });
    }
}

module.exports = SocketNamespace;
