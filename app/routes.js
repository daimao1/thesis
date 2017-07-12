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
        });

    //Singup page
    // app.get('/singup', function (req, res) {
    //     //res.sendFile(__dirname + '/views/login.html');
    //     res.render('login.ejs');
    // });
    // app.post('/singup', function (req, res) {
    //     handleLoginForm(req, res);
    // });

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

//login form handling
var formidable = require("formidable");
var util = require('util');

var userDB = require('./models/userDAO');

function handleLoginForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

        var user = {
            email: fields.email,
            password: fields.password
        };
        userDB.add(user); //store to DB
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));
    });
}