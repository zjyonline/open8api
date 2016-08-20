var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var routes = require('./routes/index');
var users = require('./routes/users');
var wx = require('./routes/wx');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator({
  customValidators: {
    isArray: function(value) {
      return Array.isArray(value);
    },
    isYyyyMMDD: function(value) {
      return (/^[0-9]{8}$/.test(value));
    },
    between: function(value,min,max) {
      return value>=min&&value<=max;
    },
    gte: function(param, num) {
      return param >= num;
    },
    gt: function(param, num) {
      return param > num;
    },
    lte: function(param, num) {
      return param <= num;
    },
    lt: function(param, num) {
      return param < num;
    },
    isNumber: function(value) {
      return !isNaN(value);
    },
    isLatitude:function(value){
      if(isNaN(+value)){
        return false;
      }
      return value > -90&& value <=90
    },
    isLongitude:function(value){
      if(isNaN(+value)){
        return false;
      }
      return value > -180&&value<=180
    },
    isPhoneno:function(value){
      return /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(value);
    },
    isToken:function(value){
      if(value && value.length == (32+11)){
        return true;
      }else{
        return false;
      }
    }
  }
}));
app.use('/', routes);
app.use('/users', users);
app.use('/wx', wx);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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


module.exports = app;
