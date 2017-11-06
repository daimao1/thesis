Aby pobrać zależności:
npm install

Aby uruchomić:
node server.js - powinien uruchomić się development mode

Aplikacja uruchamia się z odpowiednim profilem na podstawie zmiennej NODE_ENV
Na przykład:
SET NODE_ENV=development && node server.js - development mode
SET NODE_ENV=test && node server.js - tryb do testów

npm start - wywołanie skryptu "start" z pliku package.json - domyślnie development mode

Do uruchomienia bazy danych potrzebujemy XAMPP:
- włączamy serwer MySQL
- jeśli nie mamy bazy pollub73 uruchamiamy skrypt tworzący: "node scripts/create_dev_database.js" 
- Uruchamiamy server.js. Baza danych uruchomi się automatycznie na porcie 3000

*Http api:
/login - logowanie
/signup - rejestracja
/profile - dostęp tylko po zalogowaniu
/logout - wylogowanie
/board/roomId - plansza dla pokoju o numerze 'roomId', dostęp tylko po zalogowaniu
/stoptimegame - minigra

*SocketIO API

**Server
***Common api for both player and game:
****Handled events:
'connection' - emitted after io.connect call by client, like this:
    io.connect('/1')
where '1' is a room number.
After connection application is waiting for 'setName' or 'markGame' events, to identify client as player or game (browser).
'setName' - player name setter - after this event, application identify socket as a player and will create a new player object. In parameter expected string with player name.
'markGame' - after this event socket will be marked as a game (browser).

***Api for game:
****Handled events:
'disconnect' - not implemented, application throws Error.
****Emitted events:
'playersInfo' - in args array of objects (players) with two properties: 'name' and 'inRoomId'. Array length is number of the players.
'stopTime' - emitted after handle 'stopTime' event from player, in args number - player.in_room_id
'playerDice' - emitted after handle 'diceValue' event from player, in args object with 'id', and 'value' (dice results) keys.

***Api for player:
****Handled events:
'disconnect' - player will be removed from room and from database.
'stopButton' - emit event 'stopTime' to game socket
'diceValue' - emit event 'playerDice' to game socket, in args expected number with dice results

Debugowanie:
Ustawić zmienne środowiskowe za pomocą komendy 'set' w terminalu.
set DEBUG=*

Testy:
Aby uruchomić wszystkie testy korzystamy z komendy:
    npm test
Albo korzystamy z IDE. Pozdr.
✨🐢🚀✨
