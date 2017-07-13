/**
 * Created by Tobiasz on 2017-07-12.
 */

//ROUTES

module.exports = function (app, passport) {
    //Home page
    app.get('/', function (req, res) {
        res.render('homepage.ejs');
    });
    //phaser test
    app.get('/test', function (req, res) {
        res.render('index.ejs');
    });
    //Login page
    app.get('/login', function (req, res) {
        //res.render('login.ejs');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    // app.post('/login', function (req, res) {
    //     handleLoginForm(req, res);
    // });
    // process the login form
    app.post(
        '/login',
        passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function (req, res) {
            console.log("Logowanie  poprawne!");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        }
    );

    //Singup page
    // app.get('/singup', function (req, res) {
    //     //res.sendFile(__dirname + '/views/login.html');
    //     res.render('login.ejs');
    // });
    // app.post('/singup', function (req, res) {
    //     handleLoginForm(req, res);
    // });

    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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