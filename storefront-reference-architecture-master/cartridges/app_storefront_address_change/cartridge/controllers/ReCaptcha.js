"use strict";

var server = require("server");

var reCaptcha = require("~/cartridge/scripts/middleware/reCaptcha");

server.post(
    "Verify",
    server.middleware.https,
    reCaptcha.reCaptchaConfig,
    function (req, res, next) {
        var reCaptchaService = require("*/cartridge/scripts/reCaptchaService.js");
        var Resource = require("dw/web/Resource");
        var token = req.form.token;
        var errorMsg = Resource.msg(
            "error.message.account.create.error",
            "forms",
            null
        );

        if (!token) {
            res.json({
                success: false,
                errorMessage: errorMsg,
            });

            return next();
        }

        var viewData = res.getViewData();

        var response = reCaptchaService.verify({
            token: token,
            secretKey: viewData.reCaptcha.secretKey,
        });

        if (!response.isOk()) {
            res.json({
                success: false,
                errorMessage: errorMsg,
            });

            return next();
        }

        if (response.object.score >= viewData.reCaptcha.threshold) {
            res.json({
                success: true,
            });
        } else {
            res.setStatusCode(400);
            res.json({
                success: false,
                errorMessage: errorMsg,
            });
        }
        return next();
    }
);

module.exports = server.exports();
