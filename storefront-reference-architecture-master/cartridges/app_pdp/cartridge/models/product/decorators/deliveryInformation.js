"use strict";

var ContentMgr = require("dw/content/ContentMgr");

module.exports = function (object, product) {
    let deliveryInformation = "";

    const contentAsset = ContentMgr.getContent(`product-delivery-information`);

    if (contentAsset && contentAsset.online) {
        var id = product.ID;
        var productsDeliveriInfo = JSON.parse(contentAsset.custom.body);
        if (productsDeliveriInfo[id]) {
            deliveryInformation = productsDeliveriInfo[id];
        }
    }

    Object.defineProperty(object, "deliveryInformation", {
        enumerable: true,
        value: deliveryInformation,
    });
};
