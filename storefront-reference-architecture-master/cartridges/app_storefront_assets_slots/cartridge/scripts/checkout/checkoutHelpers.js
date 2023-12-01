var Resource = require("dw/web/Resource");
var Site = require("dw/system/Site");

var base = module.superModule;

var originalExports = Object.keys(module.superModule);
originalExports.forEach(function (originalExport) {
    module.exports[originalExport] = module.superModule[originalExport];
});

base.sendConfirmationEmail = function (order, locale) {
    var OrderModel = require("*/cartridge/models/order");
    var emailHelpers = require("*/cartridge/scripts/helpers/emailHelpers");
    var Locale = require("dw/util/Locale");
    var extractedProducts = require("*/cartridge/scripts/helpers/extractingProductsHelpers");

    var currentLocale = Locale.getLocale(locale);

    var orderModel = new OrderModel(order, {
        countryCode: currentLocale.country,
        containerView: "order",
    });

    var orderObject = {
        order: orderModel,
        products: extractedProducts.extractingProducts(),
    };

    var emailObj = {
        to: order.customerEmail,
        subject: Resource.msg(
            "subject.order.confirmation.email",
            "order",
            null
        ),
        from:
            Site.current.getCustomPreferenceValue("customerServiceEmail") ||
            "no-reply@testorganization.com",
        type: emailHelpers.emailTypes.orderConfirmation,
    };

    emailHelpers.sendEmail(
        emailObj,
        "checkout/confirmation/confirmationEmail",
        orderObject
    );
};

module.exports = base;
