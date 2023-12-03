"use strict";

var extarnalCustomersService = require("*/cartridge/scripts/externalCustomersService.js");

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

    var externalAddressId = UUIDUtils.createUUID();
    var response = extarnalCustomersService.externalCustomersService({
        url: "/addressBook",
        body: {
            id: externalAddressId,
            addressId: addressId,
            firstName: address.firstName,
            lastName: address.lastName,
            address1: address.address1 || "",
            address2: address.address2 || "",
            county: address.county,
            stateCode: address.states.stateCode,
            city: address.city,
            postalCode: address.postalCode,
            phone: address.phone,
        },
    });

    if (!response.isOk()) return;

    var addressBook = customer.raw.getProfile().getAddressBook();
    Transaction.wrap(function () {
        var newAddress = addressBook.createAddress(addressId);
        newAddress.custom.externalAddressId = externalAddressId;
        base.updateAddressFields(newAddress, address);
    });
};

module.exports = base;
