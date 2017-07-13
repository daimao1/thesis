/**
 * Created by Tobiasz on 2017-07-12.
 */
// passport session setup
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt'); //to password hash
const saltRounds = 8; //bcrypt hash param (cost: ~40 hashes per sec with 2GHz cpu)

var db = require('./dbconnection');
var dbconnection = db.connection; // db to table names and query exec

module.exports = function(passport) {

    // serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function(id, done) {
        dbconnection.query("SELECT * FROM " + db.admins_table + " WHERE id = " + id, function(err, rows){
            done(err, rows[0]);
        });
    });


    // LOCAL SIGNUP ================================
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
                dbconnection.query("SELECT * FROM " + db.admins_table + " WHERE email = '" + email + "'", function(err, rows) {
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
                            password: bcrypt.hashSync(password, saltRounds)  // use the generateHash function in our user model
                        }; //TODO sync hash is not recommended https://www.npmjs.com/package/bcrypt

                        var insertQuery = "INSERT INTO " + db.admins_table + " ( `email`, `password` ) values (?,?)";

                        dbconnection.query(insertQuery,[newUserMysql.email, newUserMysql.password], function(err, rows) {
                            if(err)
                                return done(err);
                            newUserMysql.id = rows.insertId;
                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );


    // LOCAL LOGIN =============================================================
    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) { // callback with email and password from our form
                dbconnection.query("SELECT * FROM " + db.admins_table + " WHERE email = '" + email + "'", function(err, rows){
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password)){
                        return done(null, false, req.flash('loginMessage', 'Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};

