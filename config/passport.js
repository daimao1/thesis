/**
 * Created by Tobiasz on 2017-07-12.
 */

//passport.js authentification config

var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var db = require('./dbconnection');
var dbconnection = db.connection;


module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function(id, done) {
        dbconnection.query("SELECT * FROM `" + db.users_table + "` WHERE id = ? ", [id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                dbconnection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        //return done(null, false, console.log('That email is already taken.'));
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUserMysql = {
                            email: email,
                            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                        };

                        var insertQuery = "INSERT INTO users ( `email`, `password` ) values (`?`,`?`)";

                        dbconnection.query(insertQuery,[newUserMysql.email, newUserMysql.password],function(err, rows) {
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) { // callback with email and password from our form
                dbconnection.query("SELECT * FROM `users` WHERE email = `?`",[email], function(err, rows){
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        //return done(null, false, console.log('No user found.'));
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};
