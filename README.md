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

Routing:
/login - logowanie
/signup - rejestracja
/profile - dostęp tylko po zalogowaniu
/logout - wylogowanie

SocketIO api:
'connection' with 'URL/roomId'
'setName' - player name setter

/stoptimegame  minigra 

Debugowanie:
Ustawić zmienne środowiskowe za pomocą komendy 'set' w terminalu.
set DEBUG=*

Testy:
Aby uruchomić wszystkie testy korzystamy z komendy:
    npm test
Albo korzystamy z IDE. Pozdr.
✨🐢🚀✨
