/// <reference path="../typings/tsd.d.ts" />
var express = require('express');
var fs = require('fs');
var apn = require('apn');
var Wilddog = require('wilddog')
var apnConnection = require('../app').apns

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

/**
 * 用于打开Mac Apps
 */
router.get('/open', function(req, res, next) {
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

    var ref = new Wilddog(options.wilddog.tokens)
    ref.once('value', function(snapshot) {
        var tokenlist = snapshot.val()
        console.log('token list' + snapshot.val());

        var exist = searchTokenExist(tokenlist, deviceToken)
        if (!exist) {
            //如果token不在列表就保存
            tokenlist.push(deviceToken)
            ref.set(tokenlist)
        }
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

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

    ref.once('value', function(snapshot) {
        var tokenlist = snapshot.val()
        console.log('token list' + snapshot.val());
        for (var index = 0; index < tokenlist.length; index++) {
            var element = tokenlist[index];
            if (token == element) {
                tokenlist.splice(index, 1);
                break
            }
        }

        tokenlist.push(deviceToken)
        ref.set(tokenlist)
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    res.send(200)
})

/**
 * 获取目前已注册的token列表
 */
router.get('/getTokens', function(req, res, next) {
    request.get(options.wilddog.tokens + ".json", function(err, response, body) {
        if (err) {
            res.send(500)
        } else {
            var tokenlist = JSON.parse(body)

            if (!isArray(tokenlist)) {
                var arr = []
                arr.push(tokenlist[0])
                tokenlist = arr
            }

            console.log('token list -> ' + tokenlist)

            res.send(200, tokenlist)
        }
    })
})

//APNS 发送消息
router.post('/push/:token', function(req, res, next) {

    var token = req.params.token

    var note = createNote(req.body)

    push([token], note)

    res.send(200)
})

//APNS 向全部用户发送消息
router.post('/pushAll', function(req, res, next) {
    var note = createNote(req.body)

    //获取当前注册的token
    request.get(options.wilddog.tokens + ".json", function(err, response, body) {
        if (err) {
            res.send(500)
        } else {
            var tokenlist = JSON.parse(body)

            if (!isArray(tokenlist)) {
                var arr = []
                arr.push(tokenlist[0])
                tokenlist = arr
            }

            console.log('token list -> ' + tokenlist)

            push(tokenlist, note)
            res.send(200)
        }
    })
})

/**
 * 创建一个消息推送内容
 */
function createNote(data) {
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.alert = {
        title: data.title,
        body: data.message,
        action: data.action
    }
    note.payload = {};
    note.urlArgs = [data.arg1, data.arg2]
    return note
}

/**
 * 发送消息推送
 * 
 * @params tokenlist 需要发送的token列表 
 * 
 * @params note 消息推送的内容，由apn.Notification创建
 */
function push(tokenlist, note) {

    tokenlist.forEach(function(token) {
        var device = new apn.Device(token)
        apnConnection.pushNotification(note, token)

    }, this);
}

/**
 * 查找当前token是否存在token 列表里
 */
function searchTokenExist(tokens, tagget) {
    for (var index = 0; index < tokens.length; index++) {
        var token = tokens[index];
        if (token == tok) {
            return true
        }
    }
    return false
}

module.exports = router;