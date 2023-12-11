"use strict";

var server = require("server");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var page = module.superModule; //inherits functionality from next Product.js found to the right on the cartridge path
server.extend(page);

server.get(
    "ProductSubscription",
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var productSubscriptionForm = server.forms.getForm(
            "productSubscription"
        );
        productSubscriptionForm.clear();
        var phone = customer.profile ? customer.profile.phoneHome : "";
        productSubscriptionForm.productSubscription.phone.value = phone;

        res.render("product/productSubscriptionForm", {
            productSubscriptionForm,
            productId: req.querystring.pid,
        });
        next();
    }
);

server.post("Subscribe", function (req, res, next) {
    var productSubscriptionHelper = require("*/cartridge/scripts/helpers/productSubscriptionHelper");
    var StringUtils = require("dw/util/StringUtils");
    var Site = require("dw/system/Site");
    var twilioService = require("*/cartridge/scripts/twilioService.js");
    var Resource = require("dw/web/Resource");

    const twilioNumber = Site.current.preferences.custom.twilioNumber;
    const productSubscriptionForm = server.forms.getForm("productSubscription");

    const phone = productSubscriptionForm.productSubscription.phone.value;
    const productId =
        productSubscriptionForm.productSubscription.productID.value;
    const isExisting = productSubscriptionHelper.isExisting(productId, phone);

    if (!isExisting.objectExcist || !isExisting.phoneExcist) {
        const isVerified =
            productSubscriptionHelper.isUserAlreadyVerified(phone);

        if (isVerified) {
            productSubscriptionHelper.savePhoneNumber(
                isExisting,
                phone,
                productId
            );
            res.json({
                showVerificationForm: false,
                success: true,
                error: false,
                message: Resource.msg(
                    "message.user.subscribed.successfuly",
                    "productSubscription",
                    null
                ),
            });
        } else {
            const verificationCode =
                productSubscriptionHelper.saveVerificationCode(phone);

            const message = StringUtils.format(
                Resource.msg(
                    "verification.code.sms.message",
                    "verificationCode",
                    null
                ),
                verificationCode
            );

            var response = twilioService.subscribe(
                phone,
                twilioNumber,
                message
            );

            if (response.isOk()) {
                res.json({
                    showVerificationForm: true,
                    success: true,
                    error: false,
                    message: Resource.msg(
                        "message.code.sent.successfuly",
                        "verificationCode",
                        null
                    ),
                });
            } else {
                res.json({
                    success: false,
                    error: false,
                    message: Resource.msg(
                        "message.failed.to.send.code",
                        "verificationCode",
                        null
                    ),
                });
            }
        }
    } else {
        res.json({
            success: false,
            error: true,
            message: Resource.msg(
                "message.user.already.subscibed",
                "productSubscription",
                null
            ),
        });
    }

    next();
});

module.exports = server.exports();