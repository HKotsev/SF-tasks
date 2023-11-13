'use strict';

var Template = require('dw/util/Template');
var ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');
var HashMap = require('dw/util/HashMap');

/**​

 * Render logic for the component.​

 */​

module.exports.render = function (context) {

   var model = new HashMap();

   // add parameters to model as required for rendering based on the given context (dw.experience.ComponentScriptContext):​

   // * context.component (dw.experience.Component)​

   // * context.content (dw.util.Map)​
   model.title=context.content.title;
   model.image = ImageTransformation.getScaledImage(context.content.image);
   model.src = context.content.src;
   model.bannerDescription=context.content.description;

 return new Template('experience/components/commerce_assets/banner').render(model).text;

}
