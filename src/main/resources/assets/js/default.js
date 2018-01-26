var footer = "<nav class='navbar navbar-default fixed-bottom justify-content-center' style='z-index:-1;'><div class='navbar-inner navbar-content-center text-center'><p>© 2018 zhazhapan Copyright.&emsp;Powered by efo.</p></div></nav>";

var globalConfig = {};

var userConfig = {};

function checkPassword(password, passwordConfirm) {
    return password.length >= userConfig.password.minLength && password.length <= userConfig.password.maxLength && password === passwordConfirm;
}

function sendVerifyCode(email, eventSrc) {
    if (isEmail(email)) {
        layer.load(1);
        $.get("/common/code/send", {email: email}, function (data) {
            layer.closeAll();
            var json = JSON.parse(data);
            if (json.status === "success") {
                layer.msg("发送成功，请前往邮箱查看");
                $(eventSrc).attr("disabled", "disabled");
                $(eventSrc).addClass("disabled");
                setTimeout(function () {
                    $(eventSrc).removeAttr("disabled");
                    $(eventSrc).removeClass("disabled");
                }, 60000);
            } else {
                alerts("获取验证码失败，请联系管理员");
            }
        });
    } else {
        alerts("邮箱格式不合法");
    }
}

$(document).ready(function () {
    layer.load(1);
    $.get("/config/global", function (data) {
        layer.closeAll();
        globalConfig = JSON.parse(data);
        /** @namespace globalConfig.loadParticle */
        if (globalConfig.loadParticle) {
            // 加载 particle粒子效果
            particlesJS.load('particles-js', 'js/particles.json', function () {
                console.log('callback - particles.js config loaded');
            });
        }
        /** @namespace globalConfig.background.useImage */
        if (globalConfig.background.useImage) {
            var idx = 0;
            /** @namespace globalConfig.background.listGenerator */
            if (globalConfig.background.listGenerator.enable) {
                var start = globalConfig.background.listGenerator.start;
                var end = globalConfig.background.listGenerator.end;
                var len = end - start + 1;
                var list = new Array(len);
                for (var i = 0; i < len; i++) {
                    /** @namespace globalConfig.background.listGenerator.suffix */
                    list[i] = globalConfig.background.listGenerator.prefix + (start++) + globalConfig.background.listGenerator.suffix;
                }
                globalConfig.background.imageList = list;
            }
            if (globalConfig.background.random) {
                idx = Math.floor(Math.random() * globalConfig.background.imageList.length);
            } else {
                /** @namespace globalConfig.background.imageIndex */
                idx = globalConfig.background.imageIndex;
            }
            /** @namespace globalConfig.background.imageList */
            var url = globalConfig.background.imageList[idx];
            if (typeof url !== "undefined") {
                var body = $("body");
                $(body).css("background", "url('" + url + "') no-repeat center center fixed");
                $(body).css("background-size", "cover");
            }
        }
        for (var m = 0; m < globalConfig.css.length; m++) {
            var node = globalConfig.css[m];
            var element = node.selector;
            var item = node.style;
            for (var j = 0; j < element.length; j++) {
                for (var k = 0; k < item.length; k++) {
                    $(element[j]).css(item[k].key, item[k].value);
                }
            }
        }
    });
    // 加载页脚
    $("#footer").html(footer);
});