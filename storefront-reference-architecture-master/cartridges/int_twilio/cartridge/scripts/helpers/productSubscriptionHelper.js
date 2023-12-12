"use strict";
var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Calendar = require("dw/util/Calendar");
var PHONE_NUMBERS_TABLE_NAME = "PRODUCT_SUBSCRIPTION";
var PHONE_VERIFICATION_TABLE_NAME = "PHONE_VERIFICATION";

var isPhoneNumberExisting = (productId, phoneNumber) => {
    var response = {};
    var numberResult = CustomObjectMgr.getCustomObject(
        PHONE_NUMBERS_TABLE_NAME,
        productId
    );

    if (empty(numberResult)) {
        response.objectExcist = false;
        response.phoneExcist = false;
        return response;
    } else {
        var existing = numberResult.custom.phoneNumbers.includes(phoneNumber);
        response.objectExcist = true;
        response.phoneExcist = existing;
        return response;
    }
};

var saveVerificationCode = (phoneNumber) => {
    var Transaction = require("dw/system/Transaction");

    var UUIDUtils = require("dw/util/UUIDUtils");
    var objectCreatedSuccessfuly = false;
    var verificationCode = UUIDUtils.createUUID();
    Transaction.wrap(() => {
        var verificationCodeObject = CustomObjectMgr.createCustomObject(
            PHONE_VERIFICATION_TABLE_NAME,
            verificationCode
        );
        verificationCodeObject.custom.phoneNumber = phoneNumber;
        var currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() + 10);
        verificationCodeObject.custom.expirationTime = new Calendar(
            currentDate
        ).time;
        if (verificationCodeObject) {
            objectCreatedSuccessfuly = true;
        }
    });
    if (objectCreatedSuccessfuly) return verificationCode;

    return false;
};

var savePhoneNumber = (subscriptionObjectInfo, phoneNumber, productId) => {
    var Transaction = require("dw/system/Transaction");

    Transaction.wrap(() => {
        var productSubscriptionObject;
        if (!subscriptionObjectInfo.objectExcist) {
            productSubscriptionObject = CustomObjectMgr.createCustomObject(
                PHONE_NUMBERS_TABLE_NAME,
                productId
            );
        } else if (
            subscriptionObjectInfo.objectExcist &&
            !subscriptionObjectInfo.phoneExcist
        ) {
            productSubscriptionObject = CustomObjectMgr.getCustomObject(
                PHONE_NUMBERS_TABLE_NAME,
                productId
            );
        }
        if (!empty(productSubscriptionObject)) {
            var phoneNumbersArray = Array.from(
                productSubscriptionObject.custom.phoneNumbers
            );
            phoneNumbersArray.push(phoneNumber);
            productSubscriptionObject.custom.phoneNumbers = phoneNumbersArray;
        }
    });
};

var isCodeExpired = (expirationDate) => {
    var currentDate = new Date();
    return currentDate >= expirationDate;
};

var verifyCode = (code, productId) => {
    var Transaction = require("dw/system/Transaction");
    var Resource = require("dw/web/Resource");

    var verificationCodeResult = CustomObjectMgr.getCustomObject(
        PHONE_VERIFICATION_TABLE_NAME,
        code
    );

    if (verificationCodeResult) {
        var isExpired = isCodeExpired(
            verificationCodeResult.custom.expirationTime
        );
        if (isExpired) {
            return {
                success: false,
                error: true,
                message: Resource.msg(
                    "message.code.is.expired",
                    "verificationCode",
                    null
                ),
            };
        }
        var phoneNumber = verificationCodeResult.custom.phoneNumber;
        var response = isPhoneNumberExisting(productId, phoneNumber);

        savePhoneNumber(response, phoneNumber, productId);

        Transaction.wrap(function () {
            CustomObjectMgr.remove(verificationCodeResult);
        });

        return {
            success: true,
            error: false,
            message: Resource.msg(
                "message.user.subscribed.successfuly",
                "productSubscription",
                null
            ),
        };
    }
    return {
        success: false,
        error: false,
        message: Resource.msg(
            "message.enter.valid.code",
            "verificationCode",
            null
        ),
    };
};

var isUserAlreadyVerified = (phoneNumber) => {
    var iteratorOfSubscriptions = CustomObjectMgr.queryCustomObjects(
        PHONE_NUMBERS_TABLE_NAME,
        `custom.phoneNumbers LIKE '${phoneNumber}'`,
        null
    );
    return iteratorOfSubscriptions.count > 0;
};
module.exports = {
    isPhoneNumberExisting,
    saveVerificationCode,
    verifyCode,
    isUserAlreadyVerified,
    savePhoneNumber,
    isCodeExpired,
};
