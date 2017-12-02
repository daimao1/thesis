//ROUTES
const RoomService = require('./room/RoomService');

module.exports = function (app, passport) {

    //Home page
    app.get('/', function (req, res) {
        if(req.isAuthenticated()) {
            const rooms = RoomService.getByAdminId(req.user.id); //Load rooms list
            res.render('index.ejs', {user: req.user, rooms: rooms, isUserLogged: true});
        } else {
            res.render('index.ejs', {isUserLogged: false});
        }
    });

    //Login page
    app.get('/login', isNotLoggedIn, function (req, res) {
        //res.render('login.ejs');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    app.post(
        '/login',
        passport.authenticate('local-login', {
            successRedirect: '/', // redirect to home
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
    app.get('/signup', isNotLoggedIn, function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to home
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    //Create new game room
    app.post('/room', isLoggedIn, function (req, res) {
        try {
            RoomService.newRoom(req.body.room_name, req.user.id);
        } catch (error) {
            console.error(error);
            badRequest(res);
        }
        res.redirect('/');
    });

    //delete room
    app.delete('/room/:id', isLoggedIn, function (req, res) {
        let room;
        try {
            room = RoomService.getById(+req.params.id, +req.user.id);
            RoomService.deleteOne(room);
        } catch (error) {
            console.error(error);
            badRequest(res);
        }
        res.end();
    });

    //single room
    app.get('/room/:id', isLoggedIn, function (req, res) {
        let room;
        try {
            room = RoomService.getById(+req.params.id, +req.user.id);
        } catch (error) {
            console.error(error);
            badRequest(res);
        }
        if (room === undefined) {
            badRequest(res);
        } else {
            res.render('room.ejs', {
                user: req.user,
                room: room
            });
        }
    });

    //logout
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    //board
    app.get('/board/:id', isLoggedIn, function (req, res) {
        let isError = false;
        try {
            RoomService.getById(+req.params.id, +req.user.id);
        } catch (error) {
            isError = true;
            console.error(error);
            badRequest(res);
        }
        if (!isError) {
            res.render('board.ejs', {
                id: req.params.id
            });
        }
    });

    //Stop-time minigame
    app.get('/stoptimegame/:id', isLoggedIn, function (req, res) {
        let isError = false;
        try {
            RoomService.getById(+req.params.id, +req.user.id);
        } catch (error) {
            isError = true;
            console.error(error);
            badRequest(res);
        }
        if (!isError) {
            res.render('stoptimegame.ejs', {
                id: req.params.id
            });
        }
    });

    app.get('/quiz/:id', isLoggedIn, function (req, res) {
        let isError = false;
        let players;
        try {
            RoomService.getById(+req.params.id, +req.user.id);
            players = RoomService.getPlayersDTOs(+req.params.id);
        } catch (error) {
            isError = true;
            console.error(error);
            badRequest(res);
        }
        if (!isError) {

            const bqg = require('./quiz/basicQuiz/BasicQuizGame');
            const quiz = bqg.startGame(+req.params.id);
            const qstn = bqg.getNextQuestion(quiz);
            let winners = bqg.getNamesOfQuizQuestionWinners(quiz); //return undefined when question not finished

            const question = {
                content: qstn.content,
                answer1: qstn.answers[0],
                answer2: qstn.answers[1],
                answer3: qstn.answers[2],
                answer4: qstn.answers[3],
                winners: winners
            };

            res.render('quiz/basic_question.ejs', {
                id: req.params.id,
                players: players,
                question: question
            });
        }
    });

    app.get('clicker/:id', isLoggedIn, (req, res) => {

    });

    app.get('/check-system-status', (req, res) => {
        res.status(200).send();
    });

    //404
    app.use(function (req, res) {
        badRequest(res);
    });
};

function badRequest(res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Not found');
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    console.log("Routes: someone trying to get unauthorized access!");
    res.redirect('/');
}

function isNotLoggedIn(req, res, next) {
    if (req.isUnauthenticated()) {
        return next();
    }
    res.redirect('/');
}