"use strict";
var decorators = require("*/cartridge/models/product/decorators/index");

var base = module.superModule;
/**
 * @param {Object} currentCustomer - Current customer
 * @param {Object} addressModel - The current customer's preferred address
 * @param {Object} orderModel - The current customer's order history
 */
var productTile = function (product, apiProduct, productType) {
    base.call(this, product, apiProduct, productType);

    decorators.description(product, apiProduct);

    return product;
};
module.exports = productTile;
