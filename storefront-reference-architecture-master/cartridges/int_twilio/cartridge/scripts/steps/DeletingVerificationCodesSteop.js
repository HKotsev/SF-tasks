var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var productSubscriptionHelper = require("~/cartridge/scripts/helpers/productSubscriptionHelper");
var ProductMgr = require("dw/catalog/ProductMgr");
var Transaction = require("dw/system/Transaction");
var Logger = require("dw/system/Logger");
var Resource = require("dw/web/Resource");

module.exports.execute = function () {
    var customObjectIterator =
        CustomObjectMgr.getAllCustomObjects("PHONE_VERIFICATION");

    try {
        while (customObjectIterator.hasNext()) {
            var verificationCodeObject = customObjectIterator.next();
            var expirationTime = verificationCodeObject.custom.expirationTime;
            var isExpired =
                productSubscriptionHelper.isCodeExpired(expirationTime);
            if (isExpired) {
                Transaction.wrap(function () {
                    CustomObjectMgr.remove(verificationCodeObject);
                });
            }
        }
    } catch (error) {
        Logger.error("Error from job {0}:", error.message);
    }
};
