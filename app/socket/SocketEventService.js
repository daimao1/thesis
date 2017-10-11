const RoomService = require('../room/RoomService');

exports.addDisconnectHandler = addDisconnectHandler;

function addDisconnectHandler(player, socketNamespace) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: Socket namespace id[${player.roomId}]: client disconnected: socket.id = [${player.socket.id}]`);
        RoomService.removePlayer(socketNamespace, player);
    });
}