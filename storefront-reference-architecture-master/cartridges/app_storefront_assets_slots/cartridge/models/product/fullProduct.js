"use strict";

var decorators = require("*/cartridge/models/product/decorators/index");

var base = module.superModule;
/**
 * @param {Object} currentCustomer - Current customer
 * @param {Object} addressModel - The current customer's preferred address
 * @param {Object} orderModel - The current customer's order history
 */
var fullProduct = function (product, apiProduct, options) {
    base.call(this, product, apiProduct, options);

    decorators.shipping(product, apiProduct);

    return product;
};
module.exports = fullProduct;
