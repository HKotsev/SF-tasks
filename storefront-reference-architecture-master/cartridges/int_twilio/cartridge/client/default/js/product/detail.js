var base = require("base/product/detail");
const bodyElement = $("body");

function popUpMessage(messageType, msg) {
    if ($(".add-to-cart-messages").length === 0) {
        bodyElement.append('<div class="add-to-cart-messages"></div>');
    }

    $(".add-to-cart-messages").append(
        '<div class="alert ' +
            messageType +
            ' add-to-basket-alert text-center" role="alert">' +
            msg +
            "</div>"
    );

    setTimeout(function () {
        $(".add-to-basket-alert").remove();
    }, 5000);
}

base.updateAttribute = function () {
    bodyElement.on("product:afterAttributeSelect", function (e, response) {
        if (response.data.product.available) {
            $(".js-cart-button").removeClass("d-none");
            $(".js-product-subscription").addClass("d-none");
        } else {
            $(".js-cart-button").addClass("d-none");
            $(".js-product-subscription").removeClass("d-none");
        }
        $(".subscription-product-id").val(response.data.product.id);
        $(".js-verification-product-id").val(response.data.product.id);
        if ($(".product-detail>.bundle-items").length) {
            response.container.data("pid", response.data.product.id);
            response.container
                .find(".product-id")
                .text(response.data.product.id);
        } else if ($(".product-set-detail").eq(0)) {
            response.container.data("pid", response.data.product.id);
            response.container
                .find(".product-id")
                .text(response.data.product.id);
        } else {
            $(".product-id").text(response.data.product.id);
            $('.product-detail:not(".bundle-item")').data(
                "pid",
                response.data.product.id
            );
        }
    });
};

base.subscribeToProduct = function () {
    bodyElement.on("submit", ".product-subscription-form", function (e) {
        e.preventDefault();
        var $form = $(this);
        var url = $form.attr("action");

        $form.spinner().start();
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            data: $form.serialize(),
            success: function (data) {
                $form.spinner().stop();
                if (!data.success) {
                    popUpMessage("alert-danger", data.message);
                } else {
                    if (data.showVerificationForm) {
                        $(".js-phone-number-verification").removeClass(
                            "d-none"
                        );
                        $(".js-product-subscription").addClass("d-none");
                    } else {
                        popUpMessage("alert-success", data.message);
                    }
                }
            },
            error: function (err) {
                if (err.responseJSON.redirectUrl) {
                    window.location.href = err.responseJSON.redirectUrl;
                }
                $form.spinner().stop();
            },
        });
        return false;
    });
};

base.verifyNumber = function () {
    bodyElement.on("submit", ".js-product-verification-form", function (e) {
        e.preventDefault();

        var $form = $(this);
        var url = $form.attr("action");

        $form.spinner().start();
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            data: $form.serialize(),
            success: function (data) {
                $form.spinner().stop();
                if (!data.success) {
                    popUpMessage("alert-danger", data.message);
                } else {
                    $(".js-phone-number-verification").addClass("d-none");
                    popUpMessage("alert-success", data.message);
                }
            },
            error: function (err) {
                if (err.responseJSON.redirectUrl) {
                    window.location.href = err.responseJSON.redirectUrl;
                }
                $form.spinner().stop();
            },
        });
        return false;
    });
};

module.exports = base;
