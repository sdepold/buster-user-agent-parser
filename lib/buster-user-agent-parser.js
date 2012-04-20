if (typeof buster == "undefined") {
    var buster = {};
}

buster.userAgentParser = {
    parse: function (userAgent) {
        if (!userAgent || typeof userAgent != "string") {
            return {};
        }

        var ua = {}, match;
        var modified = userAgent.replace(/(Mozilla|Ubuntu|AppleWebKit)\/\d+\.\d+/g, "");

        match = modified.match(/(Navigator)\/(\d\.\d[^\s]+)/) || modified.match(/([a-zA-Z]+)\/(\d+\.\d+[^\s]*)/);

        if (match) {
            ua.browser = match[1];
            ua.version = match[2];
        }

        if (!ua.browser || ua.browser == "Trident") {
            match = modified.match(/MSIE (\d+\.\d+[a-z]?)/);

            if (match) {
                ua.browser = "Internet Explorer";
                ua.version = /(\d)0$/.test(match[1]) ? match[1].replace(/0$/, "") : match[1];
            }
        }

        if (ua.browser == "Navigator") {
            ua.browser = "Netscape";
        }

        if (ua.browser == "Opera") {
            ua.version = modified.match(/Version\/(\d+\.\d+[^\s]*)/)[1];
        }

        if (/Windows/.test(modified)) {
            ua.platform = "Windows";
        } else if (/iPad/.test(userAgent)) {
            ua.platform = "iPad";
        } else if (/iPhone/.test(userAgent)) {
            ua.platform = "iPhone";
        } else if (/Darwin/.test(modified) || /Mac OS/.test(modified)) {
            ua.platform = "OS X";
        } else if (/Android/.test(modified)) {
            ua.platform = "Android";
        } else {
            ua.platform = ua.browser == "Internet Explorer" ? "Windows" : "Linux";
        }

        // set more detailed information about the operating system
        // => ua.os

        var osMap = {
            'OS X': {
                "10_7_": "OS X 10.7 (Lion)",
                "10_6_": "OS X 10.6 (Snow Leopard)",
                "10_5_": "OS X 10.5 (Leopard)",
                "10_4_": "OS X 10.4 (Tiger)"
            },
            'Windows': {
                "Windows NT 6.0": 'Windows Vista',
                "Windows NT 6.1": 'Windows 7',
                "Windows NT 6.2": 'Windows 8'
            }
        };

        for (var platform in osMap) {
            if (ua.platform == platform) {
                var osTests = osMap[platform];

                for (var osRegexpString in osTests) {
                    var osRegexp = new RegExp(osRegexpString);

                    if (osRegexp.test(userAgent)) {
                        ua.os = osTests[osRegexpString];
                    }
                }
            }
        }

        if (!ua.os) {
            ua.os = ua.platform;
        }

        if (!ua.browser) {
            match = modified.match(/Seamonkey-(\d+[^\s\(]+)/);

            if (match) {
                ua.browser = "SeaMonkey",
                ua.version = match[1];
            } else if (/Safari/.test(modified)) {
                ua.browser = "Safari";
            } else if (/AppleWebKit/.test(userAgent)) {
                ua.browser = "Safari";
            }
        }

        if ((ua.browser == "Privoxy" || ua.browser == "Version" || ua.browser == "Firefox") &&
            /AppleWebKit/.test(userAgent)) {
            ua.browser = "Safari";
        }

        if (ua.browser == "Safari") {
            if (/Mobile.+Safari/.test(userAgent) || /(Android|iPhone|iPad)/.test(ua.platform)) {
                ua.browser = "Mobile Safari";
            }

            match = userAgent.match(/Version\/([^\s]+)/);

            if (match) {
                ua.version = match[1];
            } else if (/AppleWebKit\/85/.test(userAgent) && /85\.8/.test(userAgent)) {
                ua.version = "1.0.3";
            } else if (/AppleWebKit\/85/.test(userAgent)) {
                ua.version = "1.0";
            } else if (/AppleWebKit\/124/.test(userAgent)) {
                ua.version = "1.2";
            } else if (/AppleWebKit\/125\.2/.test(userAgent)) {
                ua.version = "1.2.2";
            } else if (/AppleWebKit\/125\.5\./.test(userAgent)) {
                ua.version = "1.2.4";
            } else if (/AppleWebKit\/125\.[4-9]/.test(userAgent)) {
                ua.version = "1.2.3";
            } else if (/AppleWebKit\/312\.5/.test(userAgent)) {
                ua.version = "1.3.1";
            } else if (/AppleWebKit\/312\.8/.test(userAgent)) {
                ua.version = "1.3.2";
            } else if (/AppleWebKit\/312/.test(userAgent)) {
                ua.version = "1.3";
            } else if (/AppleWebKit\/412\.7/.test(userAgent)) {
                ua.version = "2.0.1";
            } else if (/AppleWebKit\/412/.test(userAgent)) {
                ua.version = "2.0";
            } else if (/AppleWebKit\/416\.1[1-2]/.test(userAgent)) {
                ua.version = "2.0.2";
            } else if (/AppleWebKit\/41(9|8\.[8-9])/.test(userAgent)) {
                ua.version = "2.0.4";
            } else if (/AppleWebKit\/41(8|7\.9)/.test(userAgent)) {
                ua.version = "2.0.3";
            }
        }

        return ua;
    }
};

if (typeof module == "object" && typeof require == "function") {
    module.exports = buster.userAgentParser;
}
