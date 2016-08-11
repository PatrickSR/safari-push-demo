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

router.post('/v1/pushPackages/web.com.gf.testapp', function(req, res, next) {
    // res.set('Content-Type', 'application/zip')
    // res.sendfile('public/pushpackage.zip')
    console.log('website push id', req.params.websitePushID);
    var file = fs.readFileSync('pushPackage.zip');
    res.set({
        'Content-type': 'application/zip'
    });
    res.send(file);
});


router.post('/v1/devices/:deviceToken/registrations/:websitePushID', function(req, res, next) {
    var deviceToken = req.params.deviceToken;
    var data = {
        tokens: [deviceToken],
        title: "Title",
        message: "Hello world",
        action: "View",
        "url-args": [""]
    };

    res.send(200, data);
})

router.post('/v1/log', function(req, res, next) {
    console.log('req:' + req)
    var logs = req.params;
    console.log(logs)
    res.send(200)
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
    note.urlArgs = [data.arg1, data.arg2]
    // note.urlArgs = []
    apnConnection.pushNotification(note, myMac);
    res.send(200)
})

module.exports = router;