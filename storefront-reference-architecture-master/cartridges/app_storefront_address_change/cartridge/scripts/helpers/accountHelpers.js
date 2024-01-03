"use strict";
var URLUtils = require("dw/web/URLUtils");
var endpoints = require("*/cartridge/config/oAuthRenentryRedirectEndpoints");

var base = module.superModule;

base.sendVerificationUrl = function (registeredUser) {
    var emailHelpers = require("*/cartridge/scripts/helpers/emailHelpers");
    var Site = require("dw/system/Site");
    var Resource = require("dw/web/Resource");

    var atIndex = registeredUser.custom.email.indexOf("@");
    var userName = registeredUser.custom.email.substring(0, atIndex);

    var userObject = {
        email: registeredUser.custom.email,
        firstName: userName,
        url: URLUtils.https(
            "Account-VerifyAccount",
            "accountId",
            registeredUser.custom.id
        ),
    };

    var emailObj = {
        to: registeredUser.custom.email,
        subject: Resource.msg(
            "email.subject.new.registration",
            "registration",
            null
        ),
        from:
            Site.current.getCustomPreferenceValue("customerServiceEmail") ||
            "no-reply@testorganization.com",
        type: emailHelpers.emailTypes.registration,
    };

    emailHelpers.sendEmail(
        emailObj,
        "checkout/confirmation/accountRegisteredEmail",
        userObject
    );
};

module.exports = base;
