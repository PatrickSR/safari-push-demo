/// <reference path="../typings/tsd.d.ts" />
var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Safari Push'
    });
});

router.get('/v1/pushPackages/:webid', function(req, res, next) {
    res.set('Content-Type', 'application/zip')
    res.sendfile('public/pushPackages.zip')
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

    res.send(200,data);
})

router.post('/v1/log',function (req, res, next) {
    var logs = req.logs;
    console.log(logs)
    res.send(200)
})

module.exports = router;