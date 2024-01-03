"use strict";

var server = require("server");
server.extend(module.superModule);

var reCaptcha = require("~/cartridge/scripts/middleware/reCaptcha");

server.append("Show", reCaptcha.reCaptchaConfig);

module.exports = server.exports();
