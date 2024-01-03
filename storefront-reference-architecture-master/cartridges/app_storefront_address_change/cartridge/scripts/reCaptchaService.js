"use strict";

var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
var StringUtils = require("dw/util/StringUtils");
var Resource = require("dw/web/Resource");

function verify(requestConfig) {
    var service = LocalServiceRegistry.createService("http.reCaptcha.verify", {
        createRequest: function (svc, args) {
            svc.addHeader("Content-Type", "application/x-www-form-urlencoded");
            return args;
        },

        parseResponse: function (svc, client) {
            var result;

            try {
                result = JSON.parse(client.text);
            } catch (e) {
                result = client.text;
            }

            return result;
        },

        filterLogMessage: function (msg) {
            return msg;
        },
    });

    var requestBody = `secret=${requestConfig.secretKey}&response=${requestConfig.token}`;
    var response = service.call(requestBody);

    return response;
}

module.exports = {
    verify,
};
