var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var pushLib = require('safari-push-notifications');
var apn = require('apn');
var ejs = require('ejs');

// var routes = require('./routes/index');
var users = require('./routes/users');
var push = require('./routes/push');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('.html', ejs.__express);
// app.set('view engine', 'ejs');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', push);
app.use('/users', users);

//创建push notification需要的参数zip包
function createSignature() {
  var cert = fs.readFileSync('webPush/push_cert.pem'),
    key = fs.readFileSync('webPush/no_pass_private.pem'),
    websiteJson = pushLib.websiteJSON(
      "Safari Push Notification Test", // websiteName 
      "web.com.gf.testapp", // websitePushID 
      ["https://safari-push-demo-app.herokuapp.com","https://gf-fintech.herokuapp.com","https://gf-fintech-dev.herokuapp.com"], // allowedDomains 
      //"https://safari-push-demo-app.herokuapp.com/%@/?flight=%@", // urlFormatString 
      "https://gf-fintech.herokuapp.com/%@/?flight=%@",  
      // "com.gf.safari.push.demo://xxxxxx",
      0123456789012345, // authenticationToken (zeroFilled to fit 16 chars) 
      "https://gf-fintech.herokuapp.com" // webServiceURL (Must be https!) 
    );

  pushLib.generatePackage(
      websiteJson, // The object from before / your own website.json object
      path.join('assets', 'safari_assets'), // Folder containing the iconset
      cert, // Certificate
      key // Private Key
    )
    .pipe(fs.createWriteStream('pushPackage.zip'))
    .on('finish', function() {
      console.log('pushPackage.zip is ready.');
    });
}

createSignature();
//---------------------------------------------//

var options = {};

var apnConnection = new apn.Connection(options);

//---------------------------------------------//

/**
 * 获取已注册的token列表
 */
function getTokens(callback) {
  fs.readFile(path.join(__dirname, 'token.json'), function(err, bytesRead) {
    if (err) throw err;
    var data = JSON.parse(bytesRead)
    console.log('get tokens -> ' + JSON.stringify(data))
    callback(data)
  });
}

/**
 * 保存token列表
 */
function setTokens(tokens) {
  var _token = JSON.stringify(tokens)
  console.log('set tokens ' + _token)
  fs.writeFile(path.join(__dirname, 'token.json'), _token, function(err) {
    if (err) throw err;
  });
}

/**
 * 添加一个token
 */
function addToken(token) {
  getTokens(function(tokens) {
    tokens.push(token)
    setTokens(tokens)
  })
}

/**
 * 删除一个token
 */
function removeToken(token) {
  getTokens(function(tokens) {
    for (var index = 0; index < tokens.length; index++) {
      var element = tokens[index];
      if (token == element) {
        tokens.splice(index, 1);
      break
      }
    }
    setTokens(tokens);
  })
}

removeToken("zxcvbnm")

app.getTokens = getTokens
app.setTokens = setTokens
app.addToken = addToken
app.removeToken = removeToken

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

app.apns = apnConnection;

module.exports = app;