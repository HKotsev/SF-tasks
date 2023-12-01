'use strict';
var base = module.superModule;

var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
var decorators = require('*/cartridge/models/product/decorators/index');

/**
 * Decorate product with product tile information
 * @param {Object} product - Product Model to be decorated
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {string} productType - Product type information
 * @param {Object} options - Options passed in from the factory
 *
 * @returns {Object} - Decorated product model
 */
module.exports = function productTile(product, apiProduct, productType) {
    base.call(this, product, apiProduct, productType);
    var options = productHelper.getConfig(apiProduct, {});
    decorators.availability(product, options.quantity, apiProduct.minOrderQuantity.value, apiProduct.availabilityModel);
    decorators.readyToOrder(product, options.variationModel);

    return product;
};
