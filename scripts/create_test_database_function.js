const mysql = require('mysql');

const db = {
    name: 'pollub73_test',
    admins_table: 'administrators',
    players_table: 'players',
    rooms_table: 'rooms',
    quiz_table: 'quiz'
};
let connection;

exports.dropAndCreateDatabase = dropAndCreateDatabase;

function dropAndCreateDatabase() {

    //connection = db_test.getConnection();

    connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: ''
    });

    return new Promise((resolve) => {
        connection.query('DROP DATABASE IF EXISTS ' + db.name, function (error) {
            if (error) {
                throw error;
            }
            else {
                console.log('DB DROPPED: ' + db.name);
            }
        });

        connection.query('CREATE DATABASE ' + db.name, function (error) {
            if (error) {
                throw error;
            }
            else {
                console.log('Success: db created: ' + db.name);
            }
        });

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
                \`numberOfPlayers\` INT,
                \`currentPlayerId\` INT,
                \`isGameStarted\` TINYINT,
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

        //insert test rows
        connection.query(
            'INSERT INTO ' + db.name + '.' + db.admins_table + ' SET ?',
            {email: 'test@test.pl', password: 'test'},
            function (error) {
                if (error) {
                    throw error;
                } else {
                    console.log('Insert one row to administrators table.');
                }
            }
        );
        connection.query(
            'INSERT INTO ' + db.name + '.' + db.rooms_table + ' SET ?',
            {name: 'testRoom', administrator_id: 1},
            function (error) {
                if (error) {
                    throw error;
                } else {
                    console.log('Insert one row to rooms table.');
                }
            }
        );
        connection.query(
            'INSERT INTO ' + db.name + '.' + db.players_table + ' SET ?',
            {name: 'testPlayer', room_id: 1, in_room_id: 0},
            function (error) {
                if (error) {
                    throw error;
                } else {
                    console.log('Insert one row to players table.');
                    endConnection();
                    resolve();
                }
            }
        );
    });
}

function endConnection() {
    connection.end();
}