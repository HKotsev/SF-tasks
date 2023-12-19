"use strict";

$(document).ready(function () {
    // Attach change event listener to radio buttons with class form-check-input
    $("body").on("change", ".form-check-input", function () {
        $(".form-check-input").removeAttr("checked");
        // Check the clicked radio button
        $(this).attr("checked", "checked");
        // Check which radio button is checked
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
