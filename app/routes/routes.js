var express = require('express')
var router = express.Router()

var controller = require('../controllers/overall.server.controller');
var individualController = require('../controllers/individual.server.controller');
var authorController = require('../controllers/author.server.controller');
var userController = require('../controllers/user.server.controller');
module.exports = function(app, passport) {

    // Unsecured Routes
    app.get('/', function(req, res) {
        res.render("landing.pug", { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/Overall',
        failureRedirect : '/',
        failureFlash : true
    }));

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/Overall',
        failureRedirect : '/',
        failureFlash : true
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    app.post('/getSecurityQuestion', userController.getSecurityQuestion);
    app.post('/resetPassword', userController.resetPassword);

    // Secured Routes
    app.get('/Overall', isLoggedIn, controller.renderAnalytics)
    app.get('/Overall/DataTop', isLoggedIn, controller.getAnalytics_Top)//performs queries that update analytics
    app.get('/Overall/DataBottom', isLoggedIn, controller.getAnalytics_Bottom)
    app.get('/Overall/DataLSGroup', isLoggedIn, controller.getAnalytics_LG_SG)
    app.get('/Overall/DataLHist', isLoggedIn, controller.getAnalytics_LH)
    app.get('/Overall/DataSHist', isLoggedIn, controller.getAnalytics_SH)
    app.get('/Overall/graph', isLoggedIn, controller.getOverallGraphData)
    app.get('/Overall/getNum', isLoggedIn, controller.getOverallNum)
    app.get('/Overall/getAuthor', isLoggedIn, authorController.showAuthors)//sets author value in model 
    app.get('/Overall/getAuthorArt', isLoggedIn, authorController.getAuthorArticles) //returns author edited articled
    app.get('/Overall/setAuthorArt', isLoggedIn, authorController.setArt) //sets chosen article
    app.get('/Overall/getArtTimes', isLoggedIn, authorController.getAuthorArticlesTimes)//gets author times
    //app.get('/Overall/getAuthorArticleRevis', isLoggedIn)
    app.get('/Individual', isLoggedIn, individualController.getIndividualAnalyticsLanding);
    app.get('/Individual/getData1', isLoggedIn, individualController.getData1);
    app.post('/Individual/results', isLoggedIn, individualController.getIndividualAnalyticsResults);

};

// Middleware Function to kick unauthenticated users
function isLoggedIn(req, res, next) {

    // if authenticated, continue
    if (req.isAuthenticated())
        return next();

    // if not authenticated, kick to homepage
    res.redirect('/');
}
