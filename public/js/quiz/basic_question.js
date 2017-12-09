const roomId = +document.head.id;
const socket = io.connect('/' + roomId);
socket.emit('markQuiz', roomId);
let timeLeft = 20;
let endQuestionTimeServerFlag = false;
let numberOfPlayers = 6;
let playerAnswers = 0;
document.addEventListener('DOMContentLoaded', function () {
    numberOfPlayers = +document.getElementById("numberOfPlayers").innerHTML;
});

socket.once('nextQuestion', onNextQuestion);

function onNextQuestion(question) {
    if (question === undefined) {
        endQuestion();
    } else {
        setNewQuestion(question);
    }
}

function setNewQuestion(question) {
    document.getElementById('questionContent').innerHTML = question.content;
    document.getElementById('answerA').innerHTML = question.answers[0];
    document.getElementById('answerB').innerHTML = question.answers[1];
    document.getElementById('answerC').innerHTML = question.answers[2];
    document.getElementById('answerD').innerHTML = question.answers[3];
    document.getElementById('loadingFragment').style.display = 'none';
    document.getElementById('questionDiv').style.display = 'inline';
    startQuestionTimer();
    socket.on('playerQuizAnswer', playerQuizAnswer);
}

function startQuestionTimer() {

    socket.emit('startQuestionTimer');
    socket.once('endQuestionTimeServer', endQuestionTimeServer);
    socket.once('questionResults', onQuestionResults);
    document.getElementById("progressBarFragment").style.display = "inline";
    let questionTimer = setInterval(function () {
        document.getElementById("progressBar").value = 20 - --timeLeft;
        document.getElementById("timeValue").textContent = timeLeft + "";
        if (timeLeft === 5) {
            document.getElementById("timeValue").style.color = "red";
        }
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            setTimeout(checkIsServerTimerEnd, 5000);
        }
    }, 1000);
}

function playerQuizAnswer(id) {
    console.log("Socket.io: receive playerQuizAnswer event");
    document.getElementById("spin_icon" + id).style.display = "none";
    document.getElementById("ok_icon" + id).style.display = "inline";
    if (++playerAnswers === numberOfPlayers) {
        document.getElementById("progressBarFragment").style.display = "none";
        //document.getElementById("loadingFragmentText").innerHTML = "Ładowanie wyników.";
        //document.getElementById("loadingFragment").style.display = "inline";
    }
}

function checkIsServerTimerEnd() {
    //if server timer is still counting - interrupt and send frontend timer end signal
    if (endQuestionTimeServerFlag === false) {
        console.log('Emit \'endQuestionTimeFE\' event.');
        socket.emit('endQuestionTimerOnClient');
        endQuestionTime();
    }
}

function endQuestionTimeServer() {
    endQuestionTimeServerFlag = true;
    endQuestionTime();
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
    //document.getElementById("loadingFragment").style.display = "inline";
}

/**
 * @param {string[]} winners - winners names
 */
function onQuestionResults(winners) {
    console.log('Received \'onQuestionResults\' event.');
    setTimeout(function () {
        showResults(winners);
    }, 500);
}

function showResults(winners) {
    console.log('Printing question results...');
    document.getElementById('playerList').style.display = 'none';
    document.getElementById('loadingFragment').style.display = 'none';
    if (winners === undefined || winners.length === 0) {
        document.getElementById('emptyWinners').style.display = 'inline';
    } else {
        for (let i = 0; i < numberOfPlayers; i++) {
            if (i < winners.length) {
                document.getElementById('winner' + i).innerHTML = winners[i];
            } else {
                document.getElementById('winner' + i).style.display = 'none';
            }
        }
        document.getElementById('winnersDiv').style.display = 'inline';
    }
    endQuestion();
}

function endQuestion() {
    setTimeout(function () {
        printRedirectInfo();
    }, 3000);
}

function printRedirectInfo() {
    document.getElementById("loadingFragment").style.display = 'none';
    document.getElementById("redirect").style.display = "inline";
    const redirectTime = document.getElementById("redirectTime");
    let timeout = 10;
    let redirectInterval = setInterval(function () {
        redirectTime.innerHTML = timeout-- + '';
        if (timeout < 0) {
            redirectToBoard();
            clearInterval(redirectInterval);
        }
    }, 1000);
}

function redirectToBoard() {
    setTimeout(function () {
        window.location.href = "/board/" + roomId;
    }, 400);
}