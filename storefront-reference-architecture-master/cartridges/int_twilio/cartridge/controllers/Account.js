"use strict";

/**
 * @namespace Account
 */

"use strict";

var server = require("server");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var page = module.superModule;
server.extend(page);

server.get(
    "PhoneNumberVerification",
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var phoneNumberVerificationForm = server.forms.getForm(
            "phoneNumberVerification"
        );
        phoneNumberVerificationForm.clear();

        res.render("product/phoneVerificationForm", {
            phoneNumberVerificationForm,
            productId: req.querystring.pid,
        });

        next();
    }
);

server.post("Verify", function (req, res, next) {
    var productSubscriptionHelper = require("*/cartridge/scripts/helpers/productSubscriptionHelper");
    var StringUtils = require("dw/util/StringUtils");
    var Site = require("dw/system/Site");
    var twilioService = require("*/cartridge/scripts/twilioService.js");
    var Resource = require("dw/web/Resource");

    const numberVerificationForm = server.forms.getForm(
        "phoneNumberVerification"
    );

    var code = numberVerificationForm.verification.code.value;
    var productId = numberVerificationForm.verification.productID.value;
    var response = productSubscriptionHelper.verifyCode(code, productId);

    res.json(response);

    next();
});

module.exports = server.exports();
