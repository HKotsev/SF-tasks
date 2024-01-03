"use strict";

var AddressModel = require("*/cartridge/models/address");

function getAddresses(addressBook) {
    var result = [];
    if (addressBook) {
        for (var i = 0, ii = addressBook.addresses.length; i < ii; i++) {
            result.push(new AddressModel(addressBook.addresses[i].raw).address);
        }
    }

    return result;
}

/**
 * Creates a plain object that contains the customer's preferred address
 * @param {Object} addressBook - target customer
 * @returns {Object} an object that contains information about current customer's preferred address
 */
function getPreferredAddress(addressBook) {
    var result = null;
    if (addressBook && addressBook.preferredAddress) {
        result = new AddressModel(addressBook.preferredAddress.raw).address;
    }

    return result;
}

function account(currentCustomer, addressModel, orderModel) {
    module.superModule.call(this, currentCustomer, addressModel, orderModel);

    this.addresses = getAddresses(currentCustomer.addressBook);
    this.preferredAddress =
        addressModel || getPreferredAddress(currentCustomer.addressBook);
}

module.exports = account;
