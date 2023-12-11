"use strict";

var extarnalCustomersService = require("*/cartridge/scripts/externalCustomersService.js");
var HookMgr = require("dw/system/HookMgr");

var base = module.superModule;

base.updateAddressFields = function (newAddress, address) {
    newAddress.setAddress1(address.address1 || "");
    newAddress.setAddress2(address.address2 || "");
    newAddress.setCity(address.city || "");
    newAddress.setFirstName(address.firstName || "");
    newAddress.setLastName(address.lastName || "");
    newAddress.setPhone(address.phone || "");
    newAddress.setPostalCode(address.postalCode || "");

    if (address.states && address.states.stateCode) {
        newAddress.setStateCode(address.states.stateCode);
    }

    if (address.country) {
        newAddress.setCountryCode(address.country);
    }

    newAddress.setJobTitle(address.jobTitle || "");
    newAddress.setPostBox(address.postBox || "");
    newAddress.setSalutation(address.salutation || "");
    newAddress.setSecondName(address.secondName || "");
    newAddress.setCompanyName(address.companyName || "");
    newAddress.setSuffix(address.suffix || "");
    newAddress.setSuite(address.suite || "");
    newAddress.setTitle(address.title || "");
};

/**
 * Stores a new address for a given customer
 * @param {Object} address - New address to be saved
 * @param {Object} customer - Current customer
 * @param {string} addressId - Id of a new address to be created
 * @returns {void}
 */
base.saveAddress = function (address, customer, addressId) {
    var Transaction = require("dw/system/Transaction");
    var UUIDUtils = require("dw/util/UUIDUtils");
    var serviceHook = HookMgr.hasHook("app.external.customers.data");
    var response;

    var externalAddressId = UUIDUtils.createUUID();
    address.addressId = addressId;
    if (serviceHook) {
        response = HookMgr.callHook(
            "app.external.customers.data",
            "createAddress",
            externalAddressId,
            address
        );
    }

    if (!response.isOk()) return;

    var addressBook = customer.raw.getProfile().getAddressBook();
    Transaction.wrap(function () {
        var newAddress = addressBook.createAddress(addressId);
        newAddress.custom.externalAddressId = externalAddressId;
        base.updateAddressFields(newAddress, address);
    });
};

module.exports = base;
