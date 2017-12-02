const roomId = +document.head.id;
const socket = io.connect('/' + roomId);
socket.emit('markClicker', roomId);
socket.on('startClickerTimer');
socket.once('endQuestionTimeServer', endQuestionTimeServer);
socket.once('questionResultsPrepared', onResultsPrepared);

let numberOfPlayers = 6;
document.addEventListener('DOMContentLoaded', function() {
    numberOfPlayers = +document.getElementById("numberOfPlayers").innerHTML;
});
