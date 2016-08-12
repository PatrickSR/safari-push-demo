/**
 * Created by ghchen on 16/8/11.
 */

$(document).ready(function() {
    if ('safari' in window && 'pushNotification' in window.safari) {
        var permissionData = window.safari.pushNotification.permission('web.com.gf.testapp');
        checkRemotePermission(permissionData);
    }
});

var checkRemotePermission = function (permissionData) {
    if (permissionData.permission === 'default') {
        // This is a new web service URL and its validity is unknown.
        window.safari.pushNotification.requestPermission(
            'https://gf-fintech-dev.herokuapp.com', // The web service URL.
            'web.com.gf.testapp',     // The Website Push ID.
            {}, // Data that you choose to send to your server to help you identify the user.
            checkRemotePermission         // The callback function.
        );
    }
    else if (permissionData.permission === 'denied') {
        console.log('denied');
    }
    else if (permissionData.permission === 'granted') {
        console.log('granted');
        console.log(permissionData.deviceToken);
    }
};