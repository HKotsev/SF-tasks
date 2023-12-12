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
    var twilioNumber = Site.current.preferences.custom.twilioNumber;
    let response;

    try {
        while (customObjectIterator.hasNext()) {
            var productSubscriptionObject = customObjectIterator.next();
            var productId = productSubscriptionObject.custom.productId;
            var phoneNumbersArray = Array.from(
                productSubscriptionObject.custom.phoneNumbers
            );
            var copyOfPhoneNumbers = Array.from(phoneNumbersArray);
            var currProduct = ProductMgr.getProduct(productId);
            if (currProduct.getAvailabilityModel().inStock) {
                phoneNumbersArray.forEach((number) => {
                    var message = StringUtils.format(
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
                if (response.isOk()) {
                    var index = copyOfPhoneNumbers.indexOf(number);
                    if (index !== -1) {
                        copyOfPhoneNumbers.splice(index, 1);
                    }
                }
            }
            Transaction.wrap(function () {
                if (copyOfPhoneNumbers.length === 0) {
                    CustomObjectMgr.remove(productSubscriptionObject);
                } else {
                    productSubscriptionObject.custom.phoneNumbers =
                        copyOfPhoneNumbers;
                }
            });
        }
    } catch (error) {
        Logger.error("Error from job {0}:", error.message);
    }
};
