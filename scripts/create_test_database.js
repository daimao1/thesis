const file = require('./create_test_database_function');
console.log('Start of \'create_test_database\' script.');
file.dropAndCreateDatabase()
    .then(() => {
        console.log('End of \'create_test_database\' script.');
    })
    .catch((error) => {
            throw error;
        }
    );