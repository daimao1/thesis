const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: ''
});
const db = {
    name: 'pollub73',
    admins_table: 'administrators',
    players_table: 'players',
    rooms_table: 'rooms',
    questions_table: 'questions'
};

connection.query('DROP DATABASE IF EXISTS ' + db.name);
connection.query('CREATE DATABASE ' + db.name + ' CHARACTER SET utf8 COLLATE utf8_polish_ci;');

//create administrators table
connection.query(`
    CREATE TABLE \`${db.name}\`.\`${db.admins_table}\` (\
        \`id\` INT NOT NULL AUTO_INCREMENT, \
        \`email\` VARCHAR(30) NOT NULL, \
        \`password\` CHAR(100) NOT NULL, \
        PRIMARY KEY (\`id\`), \
        UNIQUE INDEX \`email_UNIQUE\` (\`email\` ASC) \
    )`,
    function (err) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Success: table ' + db.admins_table + ' created!');
        }
    }
);

//create rooms table
connection.query(`
    CREATE TABLE \`${db.name}\`.\`${db.rooms_table}\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(20),
        \`administrator_id\` INT NOT NULL,
        \`numberOfPlayers\` INT,
        \`isGameStarted\` TINYINT,
        \`turnInProgress\` TINYINT,
        PRIMARY KEY (\`id\`,\`administrator_id\`),
        INDEX \`FK_ROOMS_ADMINISTRATORS_IDX\` (\`administrator_id\` ASC),
        CONSTRAINT \`FK_ROOMS_ADMINISTRATORS\`
        FOREIGN KEY (\`administrator_id\`)
        REFERENCES \`${db.name}\`.\`administrators\` (\`id\`)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    )`,
    function (err) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Success: table ' + db.rooms_table + ' created!');
        }
    }
);

//create players table
connection.query(`
    CREATE TABLE \`${db.name}\`.\`${db.players_table}\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(20) NOT NULL,
        \`room_id\` INT UNSIGNED,
        \`in_room_id\` INT UNSIGNED NOT NULL,
        \`field_number\` INT UNSIGNED,
        
        PRIMARY KEY (\`id\`,\`room_id\`),
        INDEX \`FK_PLAYERS_ROOMS_IDX\` (\`room_id\` ASC),
        CONSTRAINT \`FK_PLAYERS_ROOMS\` FOREIGN KEY (\`room_id\`) REFERENCES \`${db.name}\`.\`rooms\` (\`id\`)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    )`,
    function (err) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Success: table ' + db.players_table + ' created!');
        }
    }
);

//create quiz table
connection.query(`
    CREATE TABLE \`${db.name}\`.\`${db.questions_table}\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`content\` VARCHAR(300) NOT NULL,
        \`correct_answer\` VARCHAR(40) NOT NULL,
        \`answer2\` VARCHAR(40) NOT NULL,
        \`answer3\` VARCHAR(40) NOT NULL,
        \`answer4\` VARCHAR(40) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC)
    )`,
    function (err) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Success: table ' + db.questions_table + ' created!');
        }
    }
);

connection.end();