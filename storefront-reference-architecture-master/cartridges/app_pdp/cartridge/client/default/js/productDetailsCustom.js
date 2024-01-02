$(document).ready(function () {
    function checkContentHeight() {
        var $truncatedText = $(".description-container p");
        var lineHeight = parseInt($truncatedText.css("line-height"));
        var maxHeight = 2 * lineHeight;

        if ($truncatedText.prop("scrollHeight") > maxHeight) {
            $(".show-all-btn").show();
        } else {
            $(".show-all-btn").hide();
        }
    }

    checkContentHeight();

    $(window).on("resize", function () {
        checkContentHeight();
    });

    $("body").on("click", ".show-all-btn", function (e) {
        e.preventDefault();
        $(".description-container p").toggleClass("truncated-text");
        $(this).text(function (i, text) {
            return text === "Show all" ? "Hide" : "Show all";
        });

        checkContentHeight();
    });

    $("body").on("click", ".change-quantity", function () {
        var $select = $(this).siblings(".quantity-select");
        var currentValue = parseInt($select.val());
        var options = $select.find("option");
        var action = $(this).data("action");

        if (action === "increase") {
            options.each(function () {
                if (parseInt($(this).val()) > currentValue) {
                    $(this).prop("selected", true);
                    $select.trigger("change");
                    return false;
                }
            });
        } else if (action === "decrease") {
            var previousValue = null;
            options.each(function () {
                if (parseInt($(this).val()) < currentValue) {
                    previousValue = $(this).val();
                }
            });

            if (previousValue !== null) {
                $select.val(previousValue);
                $select.trigger("change");
            }
        }
    });

    var itemsMainDiv = ".MultiCarousel";
    var itemsDiv = ".MultiCarousel-inner";
    var itemWidth = "";

    $(".leftLst, .rightLst").click(function () {
        var condition = $(this).hasClass("leftLst");
        if (condition) click(0, this);
        else click(1, this);
    });

    ResCarouselSize();

    $(window).resize(function () {
        ResCarouselSize();
    });

    function ResCarouselSize() {
        var incno = 0;
        var dataItems = "data-items";
        var itemClass = ".item";
        var id = 0;
        var btnParentSb = "";
        var itemsSplit = "";
        var sampwidth = $(itemsMainDiv).width();
        var bodyWidth = $("body").width();
        $(itemsDiv).each(function () {
            id = id + 1;
            var itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(",");
            $(this)
                .parent()
                .attr("id", "MultiCarousel" + id);

            if (bodyWidth >= 1200) {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            } else if (bodyWidth >= 992) {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            } else if (bodyWidth >= 768) {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            } else {
                incno = itemsSplit[0];
                itemWidth = sampwidth / incno;
            }
            $(this).css({
                transform: "translateX(0px)",
                width: itemWidth * itemNumbers,
            });
            $(this)
                .find(itemClass)
                .each(function () {
                    $(this).outerWidth(itemWidth);
                });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");
        });
    }

    function ResCarousel(e, el, s) {
        var leftBtn = ".leftLst";
        var rightBtn = ".rightLst";
        var translateXval = "";
        var divStyle = $(el + " " + itemsDiv).css("transform");
        var values = divStyle.match(/-?[\d\.]+/g);
        var xds = Math.abs(values[4]);
        if (e == 0) {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + " " + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) {
                translateXval = 0;
                $(el + " " + leftBtn).addClass("over");
            }
        } else if (e == 1) {
            var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + " " + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) {
                translateXval = itemsCondition;
                $(el + " " + rightBtn).addClass("over");
            }
        }
        $(el + " " + itemsDiv).css(
            "transform",
            "translateX(" + -translateXval + "px)"
        );
    }

    function click(ell, ee) {
        var Parent = "#" + $(ee).parent().attr("id");
        var slide = $(Parent).attr("data-slide");
        ResCarousel(ell, Parent, slide);
    }

    $("body").on("click", ".js-btn-toggle-description", function () {
        const icon = $(this).find(".fa");
        icon.toggleClass("fa-plus fa-minus");
    });
});
