"use strict";

var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
var StringUtils = require("dw/util/StringUtils");
var Resource = require("dw/web/Resource");

function subscribe(customerPhone, twilioPhone, message) {
    var service = LocalServiceRegistry.createService(
        "http.twilio.sendMessage",
        {
            createRequest: function (svc, args) {
                svc.addHeader(
                    "Content-Type",
                    "application/x-www-form-urlencoded"
                );
                return args;
            },

            parseResponse: function (svc, client) {
                return client.text;
            },

            filterLogMessage: function (msg) {
                return msg;
            },
        }
    );

    var requestBody = `To=${customerPhone}&From=${twilioPhone}&Body=${message}`;
    var response = service.call(requestBody);

    return response;
}

module.exports = {
    subscribe: subscribe,
};
