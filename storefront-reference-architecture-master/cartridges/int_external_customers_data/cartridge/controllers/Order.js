"use strict";

var server = require("server");

var Resource = require("dw/web/Resource");
var URLUtils = require("dw/web/URLUtils");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var extarnalCustomersService = require("*/cartridge/scripts/externalCustomersService.js");

const page = module.superModule;
server.extend(page);

server.replace(
    "CreateAccount",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var OrderMgr = require("dw/order/OrderMgr");

        var formErrors = require("*/cartridge/scripts/formErrors");

        var passwordForm = server.forms.getForm("newPasswords");
        var newPassword = passwordForm.newpassword.htmlValue;
        var confirmPassword = passwordForm.newpasswordconfirm.htmlValue;
        if (newPassword !== confirmPassword) {
            passwordForm.valid = false;
            passwordForm.newpasswordconfirm.valid = false;
            passwordForm.newpasswordconfirm.error = Resource.msg(
                "error.message.mismatch.newpassword",
                "forms",
                null
            );
        }

        var order = OrderMgr.getOrder(req.querystring.ID);
        if (
            !order ||
            order.customer.ID !== req.currentCustomer.raw.ID ||
            order.getUUID() !== req.querystring.UUID
        ) {
            res.json({
                error: [
                    Resource.msg(
                        "error.message.unable.to.create.account",
                        "login",
                        null
                    ),
                ],
            });
            return next();
        }

        res.setViewData({ orderID: req.querystring.ID });
        var registrationObj = {
            firstName: order.billingAddress.firstName,
            lastName: order.billingAddress.lastName,
            phone: order.billingAddress.phone,
            email: order.customerEmail,
            password: newPassword,
        };

        if (passwordForm.valid) {
            res.setViewData(registrationObj);
            res.setViewData({ passwordForm: passwordForm });

            this.on("route:BeforeComplete", function (req, res) {
                // eslint-disable-line no-shadow
                var CustomerMgr = require("dw/customer/CustomerMgr");
                var Transaction = require("dw/system/Transaction");
                var accountHelpers = require("*/cartridge/scripts/helpers/accountHelpers");
                var addressHelpers = require("*/cartridge/scripts/helpers/addressHelpers");
                var UUIDUtils = require("dw/util/UUIDUtils");

                var registrationData = res.getViewData();

                var login = registrationData.email;
                var password = registrationData.password;
                var newCustomer;
                var authenticatedCustomer;
                var newCustomerProfile;
                var errorObj = {};

                delete registrationData.email;
                delete registrationData.password;

                const uniqueExternalId = UUIDUtils.createUUID();

                var response;

                if (serviceHook) {
                    response = HookMgr.callHook(
                        "app.external.customers.data",
                        "createUser",
                        uniqueExternalId,
                        registrationData
                    );
                }

                if (!response.isOk() && serviceHook) {
                    res.json({
                        error: Resource.msg(
                            "error.message.account.create.error",
                            "forms",
                            null
                        ),
                    });
                    return;
                }

                // attempt to create a new user and log that user in.
                try {
                    Transaction.wrap(function () {
                        var error = {};
                        newCustomer = CustomerMgr.createCustomer(
                            login,
                            password
                        );

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
                            newCustomerProfile = newCustomer.getProfile();

                            newCustomerProfile.firstName =
                                registrationData.firstName;
                            newCustomerProfile.lastName =
                                registrationData.lastName;
                            newCustomerProfile.phoneHome =
                                registrationData.phone;
                            newCustomerProfile.email = login;
                            if (serviceHook) {
                                newCustomerProfile.custom.externalCustomerId =
                                    uniqueExternalId;
                            }

                            order.setCustomer(newCustomer);

                            // save all used shipping addresses to address book of the logged in customer
                            var allAddresses =
                                addressHelpers.gatherShippingAddresses(order);
                            allAddresses.forEach(function (address) {
                                addressHelpers.saveAddress(
                                    address,
                                    { raw: newCustomer },
                                    addressHelpers.generateAddressName(address)
                                );
                            });

                            res.setViewData({ newCustomer: newCustomer });
                            res.setViewData({ order: order });
                        }
                    });
                } catch (e) {
                    errorObj.error = true;
                    errorObj.errorMessage = e.authError
                        ? Resource.msg(
                              "error.message.unable.to.create.account",
                              "login",
                              null
                          )
                        : Resource.msg(
                              "error.message.account.create.error",
                              "forms",
                              null
                          );
                }

                delete registrationData.firstName;
                delete registrationData.lastName;
                delete registrationData.phone;

                if (errorObj.error) {
                    res.json({ error: [errorObj.errorMessage] });

                    return;
                }

                accountHelpers.sendCreateAccountEmail(
                    authenticatedCustomer.profile
                );

                res.json({
                    success: true,
                    redirectUrl: URLUtils.url(
                        "Account-Show",
                        "registration",
                        "submitted"
                    ).toString(),
                });
            });
        } else {
            res.json({
                fields: formErrors.getFormErrors(passwordForm),
            });
        }

        return next();
    }
);

module.exports = server.exports();
