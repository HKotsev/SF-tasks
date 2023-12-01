'use strict';
var collections = require('*/cartridge/scripts/util/collections');
var ProductFactory = require('*/cartridge/scripts/factories/product');
var ProductMgr = require('dw/catalog/ProductMgr');

var base = module.superModule;
var originalExports = Object.keys(module.superModule);

originalExports.forEach(function (originalExport) {
    module.exports[originalExport] = module.superModule[originalExport];
});

function findOrderableVariant(model){
    var orderableVariant;

    if(model.defaultVariant && model.defaultVariant.availabilityModel.orderable){
        orderableVariant = model.defaultVariant;
    } else{
        orderableVariant = collections.find(model.variations, function(item){
            item.availabilityModel.orderable === 1;
        })
    }

    return orderableVariant;
}

/**
 * Gets default orderable variant from tile
 * @param {string} productId - product Id
 * @returns {Object} - Decorated product model
 */
function getDefaultOrderableVariant(productId){

    var apiProduct = ProductMgr.getProduct(productId);
    if (apiProduct === null) {
        return product;
    }
    var productType = base.getProductType(apiProduct);
    var product = Object.create(null);
    if(productType === 'master'){
        var options = base.getConfig(apiProduct, {});
        var orderableVariant = findOrderableVariant(options.variationModel);
        productId = orderableVariant.ID;
    }
    var productTileParams = { pview: 'tile', pid: productId };
    product = ProductFactory.get(productTileParams);

    return product;
}


base.getDefaultOrderableVariant = getDefaultOrderableVariant;
module.exports = base;
