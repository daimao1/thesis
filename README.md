Aby pobrać zależności:
npm install

Aby uruchomić:
node server.js

Do uruchomienia bazy danych potrzebujemy XAMPP:
- włączamy serwer MySQL
- jeśli nie mamy bazy pollub73 uruchamiamy skrypt tworzący: "node scripts/create_database.js" 
- Uruchamiamy server.js. Baza danych uruchomi się automatycznie na porcie 3000

Routing:
/login -logowanie
/signup -rejestracja
/profile - dostęp tylko po zalogowaniu
/logout - wylogowanie

/stoptimegame  minigra 

Debugowanie:
Ustawić zmienne środowiskowe za pomocą komendy 'set' w terminalu.
set DEBUG=*
// set NODE_ENV=dev - nie sprawdzone

Testy:
Aby uruchomić wszystkie testy korzystamy z komendy:
    npm test
Albo korzystamy z IDE. Pozdr.
✨🐢🚀✨
