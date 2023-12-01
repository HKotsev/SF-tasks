"use strict";

var ContentMgr = require("dw/content/ContentMgr");

module.exports = function (object, product) {
    let shipping = "";

    const contentAsset = ContentMgr.getContent(
        `product-shipping-${product.ID}`
    );

    if (contentAsset && contentAsset.online) {
        shipping = contentAsset.custom.body;
    }

    Object.defineProperty(object, "shipping", {
        enumerable: true,
        value: shipping,
    });
};
