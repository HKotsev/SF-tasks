"use strict";

var server = require("server");

var URLUtils = require("dw/web/URLUtils");
var Resource = require("dw/web/Resource");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var extarnalCustomersService = require("*/cartridge/scripts/externalCustomersService.js");
var HookMgr = require("dw/system/HookMgr");

const page = module.superModule;
server.extend(page);

server.replace(
    "SaveAddress",
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var CustomerMgr = require("dw/customer/CustomerMgr");
        var Transaction = require("dw/system/Transaction");
        var formErrors = require("*/cartridge/scripts/formErrors");
        var accountHelpers = require("*/cartridge/scripts/helpers/accountHelpers");
        var addressHelpers = require("*/cartridge/scripts/helpers/addressHelpers");

        var addressForm = server.forms.getForm("address");
        var addressFormObj = addressForm.toObject();
        addressFormObj.addressForm = addressForm;
        var customer = CustomerMgr.getCustomerByCustomerNumber(
            req.currentCustomer.profile.customerNo
        );
        var addressBook = customer.getProfile().getAddressBook();
        if (addressForm.valid) {
            res.setViewData(addressFormObj);
            var UUIDUtils = require("dw/util/UUIDUtils");

            this.on("route:BeforeComplete", function () {
                // eslint-disable-line no-shadow
                var formInfo = res.getViewData();
                var response;
                var errorMessage;
                var uniqueExternalId;
                var serviceHook = HookMgr.hasHook(
                    "app.external.customers.data"
                );
                var response;

                if (req.querystring.addressId && serviceHook) {
                    var externalAddressId = addressBook.getAddress(
                        req.querystring.addressId
                    ).custom.externalAddressId;

                    response = HookMgr.callHook(
                        "app.external.customers.data",
                        "updateAddress",
                        externalAddressId,
                        formInfo
                    );
                    if (!response.isOk()) {
                        errorMessage = Resource.msg(
                            "error.message.unable.to.create.address",
                            "address",
                            null
                        );
                    }
                } else {
                    uniqueExternalId = UUIDUtils.createUUID();
                    response = HookMgr.callHook(
                        "app.external.customers.data",
                        "createAddress",
                        uniqueExternalId,
                        formInfo
                    );
                    if (!response.isOk()) {
                        errorMessage = Resource.msg(
                            "error.message.unable.to.edit.address",
                            "address",
                            null
                        );
                    }
                }
                if (!response.isOk() && serviceHook) {
                    res.setStatusCode(500);
                    res.json({
                        success: false,
                        errorMessage: errorMessage,
                    });

                    return;
                }

                Transaction.wrap(function () {
                    var address = null;
                    if (
                        formInfo.addressId.equals(req.querystring.addressId) ||
                        !addressBook.getAddress(formInfo.addressId)
                    ) {
                        address = req.querystring.addressId
                            ? addressBook.getAddress(req.querystring.addressId)
                            : addressBook.createAddress(formInfo.addressId);

                        if (!req.querystring.addressId && serviceHook) {
                            address.custom.externalAddressId = uniqueExternalId;
                        }
                    }

                    if (address) {
                        if (req.querystring.addressId) {
                            address.setID(formInfo.addressId);
                        }

                        // Save form's address
                        addressHelpers.updateAddressFields(address, formInfo);

                        // Send account edited email
                        accountHelpers.sendAccountEditedEmail(customer.profile);

                        res.json({
                            success: true,
                            redirectUrl:
                                URLUtils.url("Address-List").toString(),
                        });
                    } else {
                        formInfo.addressForm.valid = false;
                        formInfo.addressForm.addressId.valid = false;
                        formInfo.addressForm.addressId.error = Resource.msg(
                            "error.message.idalreadyexists",
                            "forms",
                            null
                        );
                        res.json({
                            success: false,
                            fields: formErrors.getFormErrors(addressForm),
                        });
                    }
                });
            });
        } else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(addressForm),
            });
        }
        return next();
    }
);

module.exports = server.exports();
