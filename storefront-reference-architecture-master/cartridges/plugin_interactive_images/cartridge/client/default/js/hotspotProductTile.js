'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('./helpers/hotspotsImageHelper'));
    processInclude(require('./product/addToCart'));
});
