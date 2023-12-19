"use strict";

function reCaptchaConfig(req, res, next) {
    var Site = require("dw/system/Site");
    var URLUtils = require("dw/web/URLUtils");
    var {
        reCaptcha_siteKey: siteKey,
        reCaptcha_secretKey: secretKey,
        treshold,
    } = Site.current.preferences.custom;

    var viewData = res.getViewData();
    if (siteKey && secretKey && treshold) {
        viewData.reCaptcha = {
            siteKey,
            secretKey,
            treshold,
        };
    }

    res.setViewData(viewData);

    next();
}

module.exports = {
    reCaptchaConfig,
};
