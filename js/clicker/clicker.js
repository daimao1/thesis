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


let timeLeft = 20;
let downloadTimer = setInterval(function () {
    document.getElementById("progressBar").value = 20 - --timeLeft;
    document.getElementById("timeValue").textContent = timeLeft + "";
    if (timeLeft === 5) {
        document.getElementById("timeValue").style.color = "red";
    }
    if (timeLeft <= 0) {
        clearInterval(downloadTimer);
        setTimeout(checkIsServerTimerEnd, 5000);
    }
}, 1000);