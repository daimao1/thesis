const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'ba7796f0de13d2',
    password: '6e704ee6',
});
const db = {
    name: 'heroku_f993dad1a7fd975',
    admins_table: 'administrators',
    players_table: 'players',
    rooms_table: 'rooms',
    quiz_table: 'quiz'
};

connection.query('DROP DATABASE IF EXISTS ' + db.name);
connection.query('CREATE DATABASE ' + db.name);

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
        \`game_number\` INT,
        PRIMARY KEY (\`id\`,\`administrator_id\`),
        UNIQUE INDEX \`game_number_UNIQUE\` (\`game_number\`),
        INDEX \`FK_ROOMS_ADMINISTRATORS_IDX\` (\`administrator_id\` ASC),
        CONSTRAINT \`FK_ROOMS_ADMINISTRATORS\`
        FOREIGN KEY (\`administrator_id\`)
        REFERENCES \`${db.name}\`.\`administrators\` (\`id\`)
        ON DELETE NO ACTION
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
        \`device_id\` VARCHAR(40) NOT NULL,
        \`room_id\` INT UNSIGNED,
        \`in_room_id\` INT UNSIGNED NOT NULL,
        \`field_number\` INT UNSIGNED,
        
        PRIMARY KEY (\`id\`,\`room_id\`),
        INDEX \`FK_PLAYERS_ROOMS_IDX\` (\`room_id\` ASC),
        CONSTRAINT \`FK_PLAYERS_ROOMS\` FOREIGN KEY (\`room_id\`) REFERENCES \`${db.name}\`.\`rooms\` (\`id\`)
        ON DELETE NO ACTION
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
    CREATE TABLE \`${db.name}\`.\`${db.quiz_table}\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`content\` VARCHAR(300) NOT NULL,
        \`correct_answer\` VARCHAR(20) NOT NULL,
        \`variant1\` VARCHAR(20) NOT NULL,
        \`variant2\` VARCHAR(20) NOT NULL,
        \`variant3\` VARCHAR(20) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC)
    )`,
    function (err) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Success: table ' + db.quiz_table + ' created!');
        }
    }
);

connection.end();