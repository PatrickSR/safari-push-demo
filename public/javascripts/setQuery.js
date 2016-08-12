/**
 * Created by ghchen on 16/8/12.
 */

$(document).ready(function () {
    getTokenList();

    $('#submitBtn').click(function () {
        $.post('domain/push', {
            'title': $("input[name='title']").val() || '',   //标题
            'message': $("input[name='message']").val() || '',   //推送消息内容
            'action': $("input[name='action']").val() || '',
            'token': $("input[name='token']").val() || '',  //已成功注册推送的token
            'arg1': $("input[name='arg1']").val() || '',  //附加到url的参数
            'arg2': $("input[name='arg2']").val() || ''
        }, function (resp, status) {
            console.log(resp);
            $('.respDescription').eq(0).innerHTML = resp;
        })
    });
});

var getTokenList = function () {
    $.get('/getTokens', function (resp) {
        console.log(resp);
        if (resp.length === 0) {
            return;
        }

        var optionStr = '';
        for (var i = 0; i < resp.length; i++) {
            optionStr += '<option>' + resp[i] + '</option>';
        }
        $('#tokenList').append(optionStr);
    });
};