var BREAKPOINTS = require("*/cartridge/experience/breakpoints.json");
var Image = require("dw/experience/image/Image");
var MediaFile = require("dw/content/MediaFile");

var base = module.superModule;
var originalExports = Object.keys(module.superModule);
originalExports.forEach(function (originalExport) {
    module.exports[originalExport] = module.superModule[originalExport];
});

base.getScaledImageFromMediaFile = function (image) {
    return {
        src: {
            mobile: base.url(image, { device: "mobile" }),
            tablet: base.url(image, { device: "tablet" }),
            desktop: base.url(image, { device: "desktop" }),
        },
        alt: image.getAlt(),
    };
};

module.exports = base;
