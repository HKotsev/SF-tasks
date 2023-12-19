function verifyReCaptcha(token) {
    const url = $("#reCaptchaButton").attr("data-verify-url");

    $.ajax({
        type: "POST",
        url: url,
        data: { token },
        dataType: "json",
        success: function () {
            console.log("succes");
            $(".js-register-form").trigger("submit");
            $.spinner().stop();
        },
        error: function (err) {
            console.log(err);
            $.spinner().stop();
        },
    });
}

window.verifyReCaptcha = verifyReCaptcha;
