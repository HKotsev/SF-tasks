"use strict";
module.exports = function (object, product) {
    Object.defineProperty(object, "recommendations", {
        enumerable: true,
        value: product.recommendations ? product.recommendations : null,
    });
};
