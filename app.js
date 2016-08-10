var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

// var routes = require('./routes/index');
var users = require('./routes/users');
var push = require('./routes/push');

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

app.use('/', push);
app.use('/users', users);

//创建push notification需要的参数包
function createSignature(){
    var cert = fs.readFileSync('webPush/push_cert.pem'),
        key = fs.readFileSync('webPush/no_pass_private.pem'),
        websiteJson = pushLib.websiteJSON(
            "Safari Push Notification Test", // websiteName 
            "web.com.gf.testapp", // websitePushID 
            ["https://safari-push-demo-app.herokuapp.com"], // allowedDomains 
            "https://safari-push-demo-app.herokuapp.com/%@/", // urlFormatString 
            0123456789012345, // authenticationToken (zeroFilled to fit 16 chars) 
            "https://safari-push-demo-app.herokuapp.com" // webServiceURL (Must be https!) 
        );
    var zipBuffer = pushLib.generatePackage(
            websiteJson, // The object from before / your own website.json object 
            path.join("assets", "safari_assets"), // Folder containing the iconset 
            cert, // Certificate 
            key // Private Key 
        );
 
    fs.writeFileSync("pushPackage.zip", zipBuffer);
    console.log("success");
} 

createSignature();


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
