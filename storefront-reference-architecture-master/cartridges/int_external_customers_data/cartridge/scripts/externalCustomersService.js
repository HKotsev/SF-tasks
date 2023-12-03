"use strict";

function externalCustomersService(requestConfig) {
    const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

    const getExternalService = LocalServiceRegistry.createService(
        "http.extarnal.customer.data",
        {
            createRequest: function (svc, args) {
                if (requestConfig.method) {
                    svc.setRequestMethod(requestConfig.method);
                }
                svc.setURL(svc.getURL() + requestConfig.url);
                svc.addHeader("Content-Type", "application/json");

                return JSON.stringify(requestConfig.body);
            },
            parseResponse: function (svc, client) {
                return client.text;
            },

            filterLogMessage: function (msg) {
                return msg.replace(
                    /password\: \".*?\"/,
                    "password:************"
                );
            },
        }
    );
    return getExternalService.call();
}

module.exports = {
    externalCustomersService,
};
