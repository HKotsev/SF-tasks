"use strict";
/* global response */

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var carouselBuilder = require("*/cartridge/scripts/experience/utilities/carouselBuilder.js");
var numberOfSlides = require("*/cartridge/config/pageDesignerSlider");

/**
 * Render logic for storefront.carousel layout.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();
    numberOfSlides.forEach((element) => {
        context.content[element.id] = element.value;
    });

    model = carouselBuilder.init(model, context);

    // instruct 24 hours relative pagecache
    var expires = new Date();
    expires.setDate(expires.getDate() + 1); // this handles overflow automatically
    response.setExpires(expires);

    return new Template("experience/components/commerce_layouts/slider").render(
        model
    ).text;
};
