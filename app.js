var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
// var configRouter = require('./routes/config');
// var articleRouter = require('./routes/article');

var app = express();

// swagger generate
var expressSwagger = require('express-swagger-generator')(app)
let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a node server that developed by express',
      title: 'Swagger',
      version: '1.0.0'
    },
    host: 'localhost:4000',
    basePath: '/api',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: ''
      }
    }
  },
  route: {
    url: '/swagger',
    docs: '/swagger.json' //swagger文件 api
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/*.js'] //Path to the API handle folder
}
expressSwagger(options)

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

app.use('/', indexRouter);
app.use('/api/admin', adminRouter);
// app.use('/api/user', userRouter);
// app.use('/api/config', configRouter);
// app.use('/api/article', articleRouter);

// 超时时间设置
app.use(function (req, res, next) {
  res.sendTimeout(120 * 1000, function () {
    return res.status(408).send('请求超时')
  })
  next();
});

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

/**
 * 跨域问题
 */
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
});

module.exports = app;
