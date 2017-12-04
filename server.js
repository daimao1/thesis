const express = require('express');
const app = express();
const server = require('http').Server(app);
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const io = require('socket.io').listen(server);

//resources
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.use(express.static(__dirname + '/views'));

app.use(morgan('dev')); //log every request to the console

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(cookieParser()); // read cookies (need for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// required for passport
require('./app/config/passport')(passport);
app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/utils/Routes.js')(app, passport); //ROUTING

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on *: ' + server.address().port);
});

require('./app/socket/Socket')(io); //SOCKET CONNECTION

/**
 * Important event handler:
 * handle unhandled promise rejection -> to avoid unexpected errors with non-zero exit code
*/
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});