"use strict";

/**
 * @namespace Account
 */

var server = require("server");

var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var ACCOUNT_VERIFICATION_TABLE_NAME = "ACCOUNT_VERIFICATION_DATA";
server.extend(module.superModule);

server.replace(
    "SubmitRegistration",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var CustomerMgr = require("dw/customer/CustomerMgr");
        var Resource = require("dw/web/Resource");
        var formErrors = require("*/cartridge/scripts/formErrors");

        var registrationForm = server.forms.getForm("profile");

        // form validation

        if (
            !CustomerMgr.isAcceptablePassword(
                registrationForm.login.password.value
            )
        ) {
            registrationForm.login.password.valid = false;
            registrationForm.login.passwordconfirm.valid = false;
            registrationForm.login.passwordconfirm.error = Resource.msg(
                "error.message.password.constraints.not.matched",
                "forms",
                null
            );
            registrationForm.valid = false;
        }

        // setting variables for the BeforeComplete function
        var registrationFormObj = {
            email: registrationForm.customer.email.value,
            password: registrationForm.login.password.value,
            validForm: registrationForm.valid,
            form: registrationForm,
        };

        if (registrationForm.valid) {
            res.setViewData(registrationFormObj);
            var customAccountObject;

            this.on("route:BeforeComplete", function (req, res) {
                // eslint-disable-line no-shadow
                var Transaction = require("dw/system/Transaction");
                var accountHelpers = require("*/cartridge/scripts/helpers/accountHelpers");
                var URLUtils = require("dw/web/URLUtils");
                var CustomObjectMgr = require("dw/object/CustomObjectMgr");
                var UUIDUtils = require("dw/util/UUIDUtils");
                var authenticatedCustomer;
                var serverError;

                // getting variables for the BeforeComplete function
                var registrationForm = res.getViewData(); // eslint-disable-line

                if (registrationForm.validForm) {
                    var login = registrationForm.email;
                    var password = registrationForm.password;

                    try {
                        Transaction.wrap(function () {
                            var error = {};

                            var isCustomerExcisting =
                                CustomerMgr.getCustomerByLogin(login);

                            var isAccountCustomObjectExcisting =
                                CustomObjectMgr.queryCustomObject(
                                    ACCOUNT_VERIFICATION_TABLE_NAME,
                                    `custom.email LIKE '${login}'`,
                                    null
                                );

                            if (
                                isCustomerExcisting ||
                                isAccountCustomObjectExcisting
                            ) {
                                throw new Error();
                            }
                            var accountId = UUIDUtils.createUUID();
                            customAccountObject =
                                CustomObjectMgr.createCustomObject(
                                    ACCOUNT_VERIFICATION_TABLE_NAME,
                                    accountId
                                );
                            customAccountObject.custom.email = login;
                            customAccountObject.custom.password = password;
                        });
                    } catch (e) {
                        registrationForm.validForm = false;
                        registrationForm.form.customer.email.valid = false;
                        registrationForm.form.customer.emailconfirm.valid = false;
                        registrationForm.form.customer.email.error =
                            Resource.msg(
                                "error.message.username.invalid",
                                "forms",
                                null
                            );
                    }
                }

                delete registrationForm.password;
                formErrors.removeFormValues(registrationForm.form);

                if (registrationForm.validForm) {
                    // send a registration email
                    accountHelpers.sendVerificationUrl(customAccountObject);

                    res.json({
                        success: true,
                        redirectUrl: URLUtils.url("Login-Show")
                            .relative()
                            .toString(),
                    });

                    req.session.privacyCache.set("args", null);
                } else {
                    res.json({
                        fields: formErrors.getFormErrors(registrationForm),
                    });
                }
            });
        } else {
            res.json({
                fields: formErrors.getFormErrors(registrationForm),
            });
        }

        return next();
    }
);

server.get("VerifyAccount", function (req, res, next) {
    var CustomerMgr = require("dw/customer/CustomerMgr");
    var Resource = require("dw/web/Resource");
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var accountCustomObject = CustomObjectMgr.getCustomObject(
        ACCOUNT_VERIFICATION_TABLE_NAME,
        req.querystring.accountId
    );

    // eslint-disable-line no-shadow
    var Transaction = require("dw/system/Transaction");
    var authenticatedCustomer;
    var serverError;

    if (accountCustomObject) {
        var message = Resource.msg("account.is.verfied", "login", null);
        var login = accountCustomObject.custom.email;
        var password = accountCustomObject.custom.password;

        // attempt to create a new user and log that user in.
        try {
            Transaction.wrap(function () {
                var error = {};
                var newCustomer = CustomerMgr.createCustomer(login, password);

                var authenticateCustomerResult =
                    CustomerMgr.authenticateCustomer(login, password);
                if (authenticateCustomerResult.status !== "AUTH_OK") {
                    error = {
                        authError: true,
                        status: authenticateCustomerResult.status,
                    };
                    throw error;
                }

                authenticatedCustomer = CustomerMgr.loginCustomer(
                    authenticateCustomerResult,
                    false
                );

                if (!authenticatedCustomer) {
                    error = {
                        authError: true,
                        status: authenticateCustomerResult.status,
                    };
                    throw error;
                } else {
                    // assign values to the profile
                    var newCustomerProfile = newCustomer.getProfile();
                    newCustomerProfile.email = login;
                    CustomObjectMgr.remove(accountCustomObject);
                }
            });
        } catch (e) {
            serverError = true;
        }

        if (serverError) {
            res.setStatusCode(500);
            var message = Resource.msg("account.is.not.verfied", "login", null);
        }
    } else {
        res.setStatusCode(404);
        message = Resource.msg("verification.link.is.expired", "login", null);
    }
    res.render("account/components/accountVerification", {
        message,
    });
    return next();
});

module.exports = server.exports();
