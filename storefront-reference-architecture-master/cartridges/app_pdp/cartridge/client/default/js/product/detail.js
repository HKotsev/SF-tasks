"use strict";
var base = require("base/product/detail");

base.sizeChart = function () {
    $(".size-chart a").on("click", function (e) {
        var $sizeChart = $(".size-chart-collapsible");
        e.preventDefault();

        var url = $(this).attr("href");
        var $prodSizeChart = $(this)
            .closest(".size-chart")
            .find(".size-chart-collapsible");
        if ($prodSizeChart.is(":empty")) {
            $.ajax({
                url: url,
                type: "get",
                dataType: "json",
                success: function (data) {
                    $prodSizeChart.append(data.content);
                },
            });
        }
        if ($prodSizeChart.hasClass("active")) {
            $prodSizeChart.empty();
        }
        $prodSizeChart.toggleClass("active");
    });

    var $sizeChart = $(".size-chart-collapsible");
    $("body").on("click touchstart", function (e) {
        if ($(".size-chart").has(e.target).length <= 0) {
            $sizeChart.empty();
            $sizeChart.removeClass("active");
        }
    });
};
module.exports = base;
