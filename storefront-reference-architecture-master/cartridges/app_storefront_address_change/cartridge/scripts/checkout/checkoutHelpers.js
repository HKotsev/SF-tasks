"use strict";

var base = module.superModule;

var BasketMgr = require("dw/order/BasketMgr");
var Order = require("dw/order/Order");
var Transaction = require("dw/system/Transaction");

var ShippingHelper = require("*/cartridge/scripts/checkout/shippingHelpers");

/**
 * Copies a CustomerAddress to a Shipment as its Shipping Address
 * @param {dw.customer.CustomerAddress} address - The customer address
 * @param {dw.order.Shipment} [shipmentOrNull] - The target shipment
 */
base.copyCustomerAddressToShipment = function (address, shipmentOrNull) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var shipment = shipmentOrNull || currentBasket.defaultShipment;
    var shippingAddress = shipment.shippingAddress;
    var vat = address.raw.custom.vat;

    Transaction.wrap(function () {
        var addressObj = address;
        if (shippingAddress === null) {
            shippingAddress = shipment.createShippingAddress();
        }
        var tdsd = shippingAddress;
        shippingAddress.setFirstName(address.firstName);
        shippingAddress.setLastName(address.lastName);
        shippingAddress.setAddress1(address.address1);
        shippingAddress.setAddress2(address.address2);
        shippingAddress.setCity(address.city);
        shippingAddress.setPostalCode(address.postalCode);
        shippingAddress.setStateCode(address.stateCode);
        var countryCode = address.countryCode;
        shippingAddress.setCountryCode(countryCode.value);
        shippingAddress.setPhone(address.phone);
        shippingAddress.companyName = address.companyName;
        shippingAddress.custom.vat = addressObj.raw.custom.vat;
    });
};

/**
 * Copies a CustomerAddress to a Basket as its Billing Address
 * @param {dw.customer.CustomerAddress} address - The customer address
 */
base.copyCustomerAddressToBilling = function (address) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var billingAddress = currentBasket.billingAddress;

    Transaction.wrap(function () {
        if (!billingAddress) {
            billingAddress = currentBasket.createBillingAddress();
        }

        billingAddress.setFirstName(address.firstName);
        billingAddress.setLastName(address.lastName);
        billingAddress.setAddress1(address.address1);
        billingAddress.setAddress2(address.address2);
        billingAddress.setCity(address.city);
        billingAddress.setPostalCode(address.postalCode);
        billingAddress.setStateCode(address.stateCode);
        var countryCode = address.countryCode;
        billingAddress.setCountryCode(countryCode.value);
        if (!billingAddress.phone) {
            billingAddress.setPhone(address.phone);
        }
        billingAddress.companyName = address.companyName;
        billingAddress.custom.vat = address.raw.custom.vat;
    });
};

/**
 * Copies information from the shipping form to the associated shipping address
 * @param {Object} shippingData - the shipping data
 * @param {dw.order.Shipment} [shipmentOrNull] - the target Shipment
 */
base.copyShippingAddressToShipment = function (shippingData, shipmentOrNull) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var shipment = shipmentOrNull || currentBasket.defaultShipment;

    var shippingAddress = shipment.shippingAddress;

    Transaction.wrap(function () {
        if (shippingAddress === null) {
            shippingAddress = shipment.createShippingAddress();
        }

        shippingAddress.setFirstName(shippingData.address.firstName);
        shippingAddress.setLastName(shippingData.address.lastName);
        shippingAddress.setAddress1(shippingData.address.address1);
        shippingAddress.setAddress2(shippingData.address.address2);
        shippingAddress.setCity(shippingData.address.city);
        shippingAddress.setPostalCode(shippingData.address.postalCode);
        shippingAddress.setStateCode(shippingData.address.stateCode);
        var countryCode = shippingData.address.countryCode.value
            ? shippingData.address.countryCode.value
            : shippingData.address.countryCode;
        shippingAddress.setCountryCode(countryCode);
        shippingAddress.setPhone(shippingData.address.phone);
        shippingAddress.companyName = shippingData.address.companyName;
        shippingAddress.custom.vat = shippingData.address.vat;

        ShippingHelper.selectShippingMethod(
            shipment,
            shippingData.shippingMethod
        );
    });
};

/**
 * Copies a raw address object to the basket billing address
 * @param {Object} address - an address-similar Object (firstName, ...)
 * @param {Object} currentBasket - the current shopping basket
 */
base.copyBillingAddressToBasket = function (address, currentBasket) {
    var billingAddress = currentBasket.billingAddress;

    Transaction.wrap(function () {
        if (!billingAddress) {
            billingAddress = currentBasket.createBillingAddress();
        }

        billingAddress.setFirstName(address.firstName);
        billingAddress.setLastName(address.lastName);
        billingAddress.setAddress1(address.address1);
        billingAddress.setAddress2(address.address2);
        billingAddress.setCity(address.city);
        billingAddress.setPostalCode(address.postalCode);
        billingAddress.setStateCode(address.stateCode);
        billingAddress.setCountryCode(address.countryCode.value);
        if (!billingAddress.phone) {
            billingAddress.setPhone(address.phone);
        }
        billingAddress.companyName = address.companyName;
        billingAddress.custom.vat = address.custom.vat;
    });
};

module.exports = base;
