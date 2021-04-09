var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // Serialize user to maintain session session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize user to end session
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Signup Strategy
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err)
                    return done(err);

                // Check if email already exists or not
                if (user) {
                    return done(null, false, req.flash('loginMessage', 'This email already exists.'));
                } 
                else {
                    // create new user
                    var newUser = new User();

                    // set new user's details
                    newUser.firstName = req.body.input_firstname;
                    newUser.lastName = req.body.input_lastname;
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.securityQuestion = req.body.input_securityQuestion;
                    newUser.securityAnswer = req.body.input_securityAnswer;
                    // save new user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));

    // Signin Strategy
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);

            // User not found
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            // Password invalid
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            // Authentication Successful
            return done(null, user);
        });
    }));
};