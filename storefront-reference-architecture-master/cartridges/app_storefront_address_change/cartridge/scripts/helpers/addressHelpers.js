"use strict";

var base = module.superModule;

/**
 * Copy information from address object and save it in the system
 * @param {dw.customer.CustomerAddress} newAddress - newAddress to save information into
 * @param {*} address - Address to copy from
 */
function updateAddressFields(newAddress, address) {
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
    newAddress.custom.vat = address.vat || "";
}

/**
 * Stores a new address for a given customer
 * @param {Object} address - New address to be saved
 * @param {Object} customer - Current customer
 * @param {string} addressId - Id of a new address to be created
 * @returns {void}
 */
base.saveAddress = function (address, customer, addressId) {
    var Transaction = require("dw/system/Transaction");

    var addressBook = customer.raw.getProfile().getAddressBook();
    Transaction.wrap(function () {
        var newAddress = addressBook.createAddress(addressId);
        updateAddressFields(newAddress, address);
    });
};

/**
 * Copy dwscript address object into JavaScript object
 * @param {dw.order.OrderAddress} address - Address to be copied
 * @returns {Object} - Plain object that represents an address
 */
function copyShippingAddress(address) {
    return {
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        postalCode: address.postalCode,
        states: {
            stateCode: address.stateCode,
        },
        country: address.countryCode,
        jobTitle: address.jobTitle,
        postBox: address.postBox,
        salutation: address.salutation,
        secondName: address.secondName,
        companyName: address.companyName,
        suffix: address.suffix,
        suite: address.suite,
        title: address.title,
        vat: address.custom.vat,
    };
}

/**
 * Gather all addresses from shipments and return as an array
 * @param {dw.order.Basket} order - current order
 * @returns {Array} - Array of shipping addresses
 */
base.gatherShippingAddresses = function (order) {
    var collections = require("*/cartridge/scripts/util/collections");
    var allAddresses = [];

    if (order.shipments) {
        collections.forEach(order.shipments, function (shipment) {
            if (shipment.shippingAddress) {
                allAddresses.push(
                    copyShippingAddress(shipment.shippingAddress)
                );
            }
        });
    } else {
        allAddresses.push(order.defaultShipment.shippingAddress);
    }
    return allAddresses;
};

base.updateAddressFields = updateAddressFields;

module.exports = base;
