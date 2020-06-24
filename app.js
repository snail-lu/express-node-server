var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admins');
var configRouter = require('./routes/configs');
var articleRouter = require('./routes/articles')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json({ limit: '500kb'}));
app.use(express.urlencoded({ limit: '500kb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all('*', function(req, res, next) {
 
  res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址
   
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
   
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   
  next();
});

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/config', configRouter);
app.use('/api/articles', articleRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
