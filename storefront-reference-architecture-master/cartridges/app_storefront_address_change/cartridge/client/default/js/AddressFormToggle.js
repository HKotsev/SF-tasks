"use strict";

$(document).ready(function () {
    $("body").on("change", ".form-check-input", function () {
        $(".form-check-input").removeAttr("checked");
        $(this).attr("checked", "checked");
        if (
            $(this).is(":checked") &&
            $(this).attr("id") === "businessRadioBtn"
        ) {
            var radioButtonId = $(this).attr("id");
            $(".business-form-atrr").removeClass("d-none");
        } else {
            $(".business-form-atrr").addClass("d-none");
        }
    });
});
