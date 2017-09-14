
//ROUTES
const Room = require('./room/Room.js');
let rooms = [];
module.exports = function (app, passport) {

    //Home page
    app.get('/', function (req, res) {
        res.render('homepage.ejs', {user: req.user, isUserLogged: req.isAuthenticated()});
    });

    //phaser test
    app.get('/test', function (req, res) {
        res.render('index.ejs');
    });

    //Login page
    app.get('/login', isNotLoggedIn, function (req, res) {
        //res.render('login.ejs');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    app.post(
        '/login',
        passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function (req, res) {
            console.log("Login success!");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        }
    );

    //SignUp page
    app.get('/signup', isNotLoggedIn, function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //Admin profile - secured
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            rooms : rooms
        });
    });

    //Create new game room from form
    app.post('/profile', isLoggedIn, function (req, res) {
        newRoom(req);
        res.redirect('/profile');
    });

    //logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //board
    app.get('/board', function (req, res) {
        //res.sendFile(__dirname + '/views/stoptimegame.html');
        res.render('board.ejs');
    });

    //Stop-time minigame
    app.get('/stoptimegame', function (req, res) {
        //res.sendFile(__dirname + '/views/stoptimegame.html');
        res.render('stoptimegame.ejs');
    });
    //404
    app.use(function (req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Strony nie znaleziono');
    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    console.log("Access forbidden!"); //TODO zmienić to xD
    res.redirect('/');
}

function isNotLoggedIn(req, res, next){
    if(req.isUnauthenticated())
        return next();
    res.redirect('/');
}

function newRoom(req){
    let room = new Room(req.body.room_name, 1);
    console.log('1: ' + room.databaseId);
    console.log(room);
    setTimeout(function(){ console.log('2: ' + room.databaseId); }, 1000);

    rooms[0] = room;
    console.log("3: " + rooms[0].name);
}