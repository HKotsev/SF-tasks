var base = module.superModule;

var originalExports = Object.keys(module.superModule);
originalExports.forEach(function (originalExport) {
    module.exports[originalExport] = module.superModule[originalExport];
});

module.exports.shipping = require("*/cartridge/models/product/decorators/shipping");
