const roomId = +document.head.id;
const socket = io.connect('/' + roomId);
socket.emit('markQuiz', roomId);
socket.on('playerQuizAnswer', playerQuizAnswer);
socket.once('endQuestionTimeServer', endQuestionTimeServer);
socket.once('questionResultsPrepared', onResultsPrepared);
let endQuestionTimeServerFlag = false;
let numberOfPlayers = 6;
document.addEventListener('DOMContentLoaded', function() {
    numberOfPlayers = +document.getElementById("numberOfPlayers").innerHTML;
});
let playerAnswers = 0;

//TODO handle socket disconnect

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

function playerQuizAnswer(id) {
    console.log("Socket.io: receive playerQuizAnswerEvent");
    document.getElementById("spin_icon" + id).style.display = "none";
    document.getElementById("ok_icon" + id).style.display = "inline";
    if(++playerAnswers === numberOfPlayers){
        document.getElementById("progressBarFragment").style.display = "none";
        document.getElementById("loadingFragment").style.display = "inline";
    }
}

function endQuestionTimeServer() {
    endQuestionTimeServerFlag = true;
    endQuestionTime();
}

function checkIsServerTimerEnd(){
    //if server timer is still counting - interrupt and send frontend timer end signal
    if (endQuestionTimeServerFlag === false) {
        console.log('Emit \'endQuestionTimeFE\' event.');
        socket.emit('endQuestionTimeFE');
        endQuestionTime();
    }
}

function endQuestionTime() {
    if (timeLeft > 0) {
        setTimeout(endQuestionTime, 400);
        return;
    }

    for (let i = 0; i < numberOfPlayers; i++) {
        if (document.getElementById("spin_icon" + i) === null) {
            break;
        } else if (document.getElementById("ok_icon" + i).style.display === "none") {
            document.getElementById("spin_icon" + i).style.display = "none";
            document.getElementById("no_answer_icon" + i).style.display = "inline";
        }
    }
    document.getElementById("progressBarFragment").style.display = "none";
    document.getElementById("loadingFragment").style.display = "inline";
}

function onResultsPrepared() {
    setTimeout(function () {
        location.reload();
    }, 2000);
}
