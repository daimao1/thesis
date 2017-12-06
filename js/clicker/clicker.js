const roomId = +document.head.id;
const socket = io.connect('/' + roomId);
socket.emit('markClicker', roomId);
let timeout = 10;
socket.once('clickerTimeout', (clickerTimeout) => {
    timeout = clickerTimeout;
});
socket.once('clickerResults', onClickerResults);

let numberOfPlayers = 6;
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('help_modal').style.display = 'block';
    numberOfPlayers = +document.getElementById("numberOfPlayers").innerHTML;
});

function onHelpModalClose() {
    document.getElementById('help_modal').style.display = 'none';
    startCountdown();
}

function startCountdown() {
    let countdownSpan = document.getElementById('countdown');
    let counter = 6;
    let countdown_interval = setInterval(function () {
        countdownSpan.innerHTML = --counter + "";
        if (counter === 2) {
            countdownSpan.style.color = 'red';
        }
        if (counter < 0) {
            let header = document.getElementById("be_ready_header");
            header.style.fontSize = "600%";
            header.style.fontWeight = "bold";
            header.style.color = "red";
            header.innerHTML = "START";
            countdownSpan.style.visibility = "hidden";
            gameTimerStart(countdownSpan, header);
            clearInterval(countdown_interval);
        }
    }, 1000);
}

function gameTimerStart(countdownSpan, header) {
    socket.emit('startClickerTimer');
    countdownSpan.style.fontSize = "700%";
    let counter = timeout;
    countdownSpan.innerHTML = counter;
    countdownSpan.style.visibility = "visible";
    let gameTime_interval = setInterval(function () {
        countdownSpan.innerHTML = --counter;
        if (counter === 0) {
            header.innerHTML = 'STOP';
            countdownSpan.style.visibility = 'hidden';
            socket.emit('stopClickerTimer');
            clearInterval(gameTime_interval);
        }
    }, 1000);
}

function onClickerResults(playerNamesInOrder, sortedResults) {
    document.getElementById('be_ready_header').style.display = 'none';
    document.getElementById('countdown').style.display = 'none';

    for (let i = 0; i < numberOfPlayers; i++) {
        if (document.getElementById("result" + i) === null || document.getElementById("playerName" + 1) === null) {
            break;
        }
        document.getElementById("playerName" + i).innerHTML = playerNamesInOrder[i];
        document.getElementById("result" + i).innerHTML = sortedResults[i];
    }
    colorWinners();
    document.getElementById("results_div").style.display = "inline";

    setTimeout(function () {
        printRedirectInfo();
    }, 3000);
}

function printRedirectInfo() {
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

function colorWinners() {
    if (numberOfPlayers === 2) {
        document.getElementById("resultsRow0").classList.add('silverWinner');
    } else if (numberOfPlayers > 2) {
        document.getElementById("resultsRow0").classList.add('goldWinner');
        document.getElementById("resultsRow1").classList.add('silverWinner');
    }
}