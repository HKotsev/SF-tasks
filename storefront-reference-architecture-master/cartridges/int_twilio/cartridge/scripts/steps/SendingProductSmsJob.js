var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var ProductMgr = require("dw/catalog/ProductMgr");
var Transaction = require("dw/system/Transaction");
var twilioService = require("~/cartridge/scripts/twilioService.js");
var Logger = require("dw/system/Logger");
var Resource = require("dw/web/Resource");
var StringUtils = require("dw/util/StringUtils");
var Site = require("dw/system/Site");

module.exports.execute = function () {
    var customObjectIterator = CustomObjectMgr.getAllCustomObjects(
        "PRODUCT_SUBSCRIPTION"
    );
    const twilioNumber = Site.current.preferences.custom.twilioNumber;
    let response;

    try {
        while (customObjectIterator.hasNext()) {
            var productSubscriptionObject = customObjectIterator.next();
            var productId = productSubscriptionObject.custom.productId;
            var phoneNumbers = productSubscriptionObject.custom.phoneNumbers;
            var currProduct = ProductMgr.getProduct(productId);
            if (currProduct.getAvailabilityModel().inStock) {
                phoneNumbers.forEach((number) => {
                    const message = StringUtils.format(
                        Resource.msg(
                            "product.back.instock.sms",
                            "productSubscription",
                            null
                        ),
                        currProduct.getName()
                    );

                    response = twilioService.subscribe(
                        number,
                        twilioNumber,
                        message
                    );
                });
            }
            if (response.isOk()) {
                Transaction.wrap(function () {
                    CustomObjectMgr.remove(productSubscriptionObject);
                });
            }
        }
    } catch (error) {
        Logger.error("Error from job {0}:", error.message);
    }
};
