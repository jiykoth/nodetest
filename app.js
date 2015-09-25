var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var UserApp = require('./userapp').UserApp;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var userApp = new UserApp();

app.get('/getUsers', function(req, res) {
	userApp.getUsers(function(error, users){
		if (error) { callback(error) }
		else { res.send(users);	}
	});
});

app.post('/addUser', function(req, res) {
	userApp.addUser({
		email: req.body.email,
		fname: req.body.fname, 
		lname: req.body.lname
	}, function(error, msg) {
		if (error) { callback(error) }
		else { res.send(msg); }
	});
});

app.post('/updateUser', function(req, res) {
	userApp.updateUser({
		id: req.body.id,
		email: req.body.email,
		fname: req.body.fname,
		lname: req.body.lname
	}, function(error, msg) {
		if (error) { callback(error) }
		else { res.send(msg); }
	});
});

app.post('/deleteUser', function(req, res) {
	userApp.deleteUser({
		id: req.body.id
	}, function(error, msg) {
		if (error) { callback(error) }
		else { res.send(msg); }
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;



















































































