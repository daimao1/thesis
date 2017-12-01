const roomId = +document.head.id;
const socket = io.connect('/' + roomId);
socket.emit('markQuiz', roomId);
socket.on('playerQuizAnswer', playerQuizAnswer);

let timeLeft = 20;
let downloadTimer = setInterval(function () {
    document.getElementById("progressBar").value = 20 - --timeLeft;
    document.getElementById("timeValue").textContent = timeLeft + "";
    if (timeLeft <= 0) {
        clearInterval(downloadTimer);
    }
}, 1000);


function playerQuizAnswer(id) {
    console.log("Socket.io: receive playerQuizAnswerEvent");
    document.getElementById("spin_icon"+id).style.display = "none";
    document.getElementById("ok_icon" + id).style.display = "inline";
}