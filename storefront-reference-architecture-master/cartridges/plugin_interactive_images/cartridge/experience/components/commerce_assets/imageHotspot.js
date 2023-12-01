'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');
var URLUtils = require('dw/web/URLUtils');
var productHelpers = require('*/cartridge/scripts/helpers/productHelpers');

/**
 * Render logic for the storefront.editorialRichText component
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
    var content = context.content;

    var isEditMode = PageRenderHelper.isInEditMode();

    model.desktopImage = ImageTransformation.getScaledImage(content.desktopImage).src.desktop || '';
    model.tabletImage = ImageTransformation.getScaledImage(content.tabletImage).src.tablet || '';
    model.mobileImage = ImageTransformation.getScaledImage(content.mobileImage).src.mobile || '';
    model.addToCartUrl = URLUtils.url('Cart-AddProduct').toString();

    model.images = content.hotspots ? content.hotspots.images : [];
    model.isEditMode = isEditMode;

    // fetch products for the hotspots if it's not PD edit mode
    if (!isEditMode) {
        var images = model.images;
        images.toArray().forEach(function (image) {
                var hotspots = image.hotspots.toArray().map(function (hotspot) {
                var product = productHelpers.getDefaultOrderableVariant(hotspot[2]);

                hotspot.push(product);
                hotspot.push(URLUtils.url('Product-Show', 'pid', product.id).toString())
                return hotspot;
            });
            image.hotspots = hotspots; // eslint-disable-line no-param-reassign
        });
    }

    return new Template('experience/components/commerce_assets/imageHotspot').render(model).text;
};
