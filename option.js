var option = {
    wilddog: {
        //测试环境
        url: "https://gf-fintech-dev.wilddogio.com/",
        tokens: "https://gf-fintech-dev.wilddogio.com/tokens"
            //正式环境
            // url:"https://gf-fintech.wilddogio.com/",
            // tokens:"https://gf-fintech.wilddogio.com/tokens"
    },
    pushPackage: {
        allowedDomains: [
            "https://gf-fintech.herokuapp.com",
            "https://gf-fintech-dev.herokuapp.com"
        ],
        webServiceURL: "https://gf-fintech-dev.herokuapp.com",
        urlFormatString:"https://gf-fintech-dev.herokuapp.com/%@/?flight=%@",
        authToken: "0123456789012345",
        websiteName:" GF-Fintech",
        websitePushID:"web.com.gf.testapp"
    }

}

module.exports = option