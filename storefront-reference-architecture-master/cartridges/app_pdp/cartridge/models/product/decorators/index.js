var base = module.superModule;

base.deliveryInformation = require("*/cartridge/models/product/decorators/deliveryInformation");
base.recommendations = require("*/cartridge/models/product/decorators/recommendations");

module.exports = base;
