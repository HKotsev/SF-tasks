"use strict";
var base = require("base/checkout/checkout");
base.addressHelpers = require("./address");
base.shippingHelpers = require("./shipping");
base.billingHelpers = require("./billing");
base.summaryHelpers = require("./summary");

module.exports = base;
