"use strict";

var extractingProducts = function () {
    var ProductFactory = require("*/cartridge/scripts/factories/product");
    var ContentMgr = require("dw/content/ContentMgr");
    var EXCLUSIVE_PRODUCTS_ID = "exclusive-product-tiles";
    var productAsset = ContentMgr.getContent(EXCLUSIVE_PRODUCTS_ID);

    if (productAsset && productAsset.online) {
        var productsIds = productAsset.custom.body.toString().split(",");

        var productTiles = productsIds.map((id) => {
            return ProductFactory.get({ pview: "tile", pid: id });
        });

        return productTiles;
    }
    return;
};
module.exports = {
    extractingProducts,
};
