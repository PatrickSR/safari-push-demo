/// <reference path="../typings/tsd.d.ts" />
var express = require('express');
var fs = require('fs');
var apn = require('apn');

var router = express.Router();

router.use(function(req, res, next) {
    console.log('req -> ' + JSON.stringify(req.body))
    next()
})

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', {
    //     title: 'Safari Push'
    // });
    res.render('index')
});

router.get('/open',function (req, res ,next) {
    res.render('open')
})

/**
 * web.com.gf.testapp
 * websitePushID 貌似暂时没有用处
 */
router.post('/v1/pushPackages/:websitePushID', function(req, res, next) {
    // res.set('Content-Type', 'application/zip')
    // res.sendfile('public/pushpackage.zip')
    console.log('website push id', req.params.websitePushID);
    var file = fs.readFileSync('pushPackage.zip');
    res.set({
        'Content-type': 'application/zip'
    });
    res.send(file);
});

/**
 * Registering or Updating Device Permission Policy
 * When users first grant permission, or later change their permission levels for your website, a POST request is sent 
 */
router.post('/v1/devices/:deviceToken/registrations/:websitePushID', function(req, res, next) {
    var deviceToken = req.params.deviceToken;
    
    var app = require('../app')
    app.addToken(deviceToken)
    res.send(200);
})

/**
 * If an error occurs, a POST request will sent
 */
router.post('/v1/log', function(req, res, next) {
    console.log('log -> ' + JSON.stringify(req.body))
    res.send(200)
})

/**
 * Forgetting Device Permission Policy
 * If a user removes permission of a website in Safari preferences, a DELETE request will sent
 */
router.delete('/v1/devices/:deviceToken/registrations/:websitePushID', function(req, res, next) {
    var token = req.params.deviceToken
    var app = require('../app')
    app.removeToken(token)
    res.send(200)
})

/**
 * 获取目前已注册的token列表
 */
router.get('/getTokens',function (req,res,next) {
    var app = require('../app')
    app.getTokens(function (tokens) {
        res.send(tokens)
    })
})




//APNS 发送消息
router.post('/push', function(req, res, next) {
    var app = require('../app')
    var apnConnection = app.apns

    var data = req.body

    var myMac = new apn.Device(data.token);

    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.alert = {
        title: data.title,
        body: data.message,
        action: data.action
    }
    note.payload = {};
    // note.urlArgs = []
    // note.urlArgs = [data.arg1, data.arg2]
    note.urlArgs = [data.arg1]
        // note.urlArgs = []
    apnConnection.pushNotification(note, myMac);
    res.send(200)
})

module.exports = router;