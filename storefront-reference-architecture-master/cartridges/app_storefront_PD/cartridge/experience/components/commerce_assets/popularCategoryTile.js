"use strict";
/* global response */

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var URLUtils = require("dw/web/URLUtils");
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");

/**
 * Render logic for the storefront.popularCategories.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();
    var content = context.content;

    var catObj = {};
    var cat = content.category;
    if (cat) {
        catObj.ID = cat.ID;
        catObj.compID = context.component.ID;

        catObj.title = content.title;

        catObj.name = cat.displayName;

        catObj.description = content.description;

        if (cat.image) {
            model.image = ImageTransformation.getScaledImageFromMediaFile(
                cat.image
            );
        } else {
            model.image = null;
        }
        catObj.url =
            cat.custom &&
            "alternativeUrl" in cat.custom &&
            cat.custom.alternativeUrl
                ? cat.custom.alternativeUrl
                : URLUtils.url("Search-Show", "cgid", cat.getID()).toString();
    }
    model.position = content.position;
    model.category = catObj;

    // instruct 24 hours relative pagecache
    var expires = new Date();
    expires.setDate(expires.getDate() + 1); // this handles overflow automatically
    response.setExpires(expires);

    return new Template(
        "experience/components/commerce_assets/popularCategoryTile"
    ).render(model).text;
};
