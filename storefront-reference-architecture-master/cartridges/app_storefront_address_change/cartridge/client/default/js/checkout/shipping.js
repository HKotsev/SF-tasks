var base = require('base/checkout/shipping')

base.methods.updateShippingAddressFormValues = function (shipping) {
    var addressObject = $.extend({}, shipping.shippingAddress);

    if (!addressObject) {
        addressObject = {
            firstName: null,
            lastName: null,
            companyName: null,
            vat: null,
            address1: null,
            address2: null,
            city: null,
            postalCode: null,
            stateCode: null,
            countryCode: null,
            phone: null
        };
    }

    addressObject.isGift = shipping.isGift;
    addressObject.giftMessage = shipping.giftMessage;

    $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
        var form = el.form;
        if (!form) return;
        var countryCode = addressObject.countryCode;

        $('input[name$=_firstName]', form).val(addressObject.firstName);
        $('input[name$=_lastName]', form).val(addressObject.lastName);
        $('input[name$=_companyName]', form).val(addressObject.companyName);
        $('input[name$=_vat]', form).val(addressObject.vat);
        $('input[name$=_address1]', form).val(addressObject.address1);
        $('input[name$=_address2]', form).val(addressObject.address2);
        $('input[name$=_city]', form).val(addressObject.city);
        $('input[name$=_postalCode]', form).val(addressObject.postalCode);
        $('select[name$=_stateCode],input[name$=_stateCode]', form)
            .val(addressObject.stateCode);

        if (countryCode && typeof countryCode === 'object') {
            $('select[name$=_country]', form).val(addressObject.countryCode.value);
        } else {
            $('select[name$=_country]', form).val(addressObject.countryCode);
        }

        $('input[name$=_phone]', form).val(addressObject.phone);

        $('input[name$=_isGift]', form).prop('checked', addressObject.isGift);
        $('textarea[name$=_giftMessage]', form).val(addressObject.isGift && addressObject.giftMessage ? addressObject.giftMessage : '');
    });

    $('body').trigger('shipping:updateShippingAddressFormValues', { shipping: shipping });
}

base.methods.updatePLIShippingSummaryInformation = function (productLineItem, shipping, order, options) {
    var $pli = $('input[value=' + productLineItem.UUID + ']');
    var form = $pli && $pli.length > 0 ? $pli[0].form : null;

    if (!form) return;

    var $viewBlock = $('.view-address-block', form);

    var address = shipping.shippingAddress || {};
    var selectedMethod = shipping.selectedShippingMethod;

    var nameLine = address.firstName ? address.firstName + ' ' : '';
    if (address.lastName) nameLine += address.lastName;

    var address1Line = address.address1;
    var address2Line = address.address2;

    var companyNameLine = address.companyName;
    var vatLine = address.vat;

    var phoneLine = address.phone;

    var shippingCost = selectedMethod ? selectedMethod.shippingCost : '';
    var methodNameLine = selectedMethod ? selectedMethod.displayName : '';
    var methodArrivalTime = selectedMethod && selectedMethod.estimatedArrivalTime
        ? '(' + selectedMethod.estimatedArrivalTime + ')'
        : '';

    var tmpl = $('#pli-shipping-summary-template').clone();

    $('.ship-to-name', tmpl).text(nameLine);
    $('.ship-to-company-name', tmpl).text(companyNameLine);
    $('.ship-to-vat', tmpl).text(vatLine);
    $('.ship-to-address1', tmpl).text(address1Line);
    $('.ship-to-address2', tmpl).text(address2Line);
    $('.ship-to-city', tmpl).text(address.city);
    if (address.stateCode) {
        $('.ship-to-st', tmpl).text(address.stateCode);
    }
    $('.ship-to-zip', tmpl).text(address.postalCode);
    $('.ship-to-phone', tmpl).text(phoneLine);

    if (!address2Line) {
        $('.ship-to-address2', tmpl).hide();
    }

    if (!phoneLine) {
        $('.ship-to-phone', tmpl).hide();
    }

    if (shipping.selectedShippingMethod) {
        $('.display-name', tmpl).text(methodNameLine);
        $('.arrival-time', tmpl).text(methodArrivalTime);
        $('.price', tmpl).text(shippingCost);
    }

    if (shipping.isGift) {
        $('.gift-message-summary', tmpl).text(shipping.giftMessage);
        var shipment = $('.gift-message-' + shipping.UUID);
        $(shipment).val(shipping.giftMessage);
    } else {
        $('.gift-summary', tmpl).addClass('d-none');
    }
    // checking h5 title shipping to or pickup
    var $shippingAddressLabel = $('.shipping-header-text', tmpl);
    $('body').trigger('shipping:updateAddressLabelText',
        { selectedShippingMethod: selectedMethod, resources: order.resources, shippingAddressLabel: $shippingAddressLabel });

    $viewBlock.html(tmpl.html());

    $('body').trigger('shipping:updatePLIShippingSummaryInformation', {
        productLineItem: productLineItem,
        shipping: shipping,
        order: order,
        options: options
    });
}

base.methods.clearShippingForms = function (order) {
    order.shipping.forEach(function (shipping) {
        $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
            var form = el.form;
            if (!form) return;

            $('input[name$=_firstName]', form).val('');
            $('input[name$=_lastName]', form).val('');
            $('input[name$=_companyName]', form).val('');
            $('input[name$=_vat]', form).val('');
            $('input[name$=_address1]', form).val('');
            $('input[name$=_address2]', form).val('');
            $('input[name$=_city]', form).val('');
            $('input[name$=_postalCode]', form).val('');
            $('select[name$=_stateCode],input[name$=_stateCode]', form).val('');
            $('select[name$=_country]', form).val('');

            $('input[name$=_phone]', form).val('');

            $('input[name$=_isGift]', form).prop('checked', false);
            $('textarea[name$=_giftMessage]', form).val('');
            $(form).find('.gift-message').addClass('d-none');

            $(form).attr('data-address-mode', 'new');
            var addressSelectorDropDown = $('.addressSelector option[value=new]', form);
            $(addressSelectorDropDown).prop('selected', true);
        });
    });

    $('body').trigger('shipping:clearShippingForms', { order: order });
}

module.exports = base;