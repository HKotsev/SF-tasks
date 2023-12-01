'use strict';

module.exports.init = function (editor) {
    var optionsInit = [];
    // Init editor configuration
    editor.configuration.options.put('init', optionsInit);
};
