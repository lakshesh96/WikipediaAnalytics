var express = require('express');
var app = express();
var path = require('path');

// Imports required for Authentication
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());

// var wikiroutes = require('./app/routes/overall.server.routes');

app.set('views', path.join(__dirname,'/app/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/wiki',wikiroutes);

// App imports required for passport
app.use(session({ secret: 'comp5347' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes/routes.js')(app, passport);

app.listen(3000, function () {
	console.log('Revision app listening on port 3000!')
});
	
module.exports = app;