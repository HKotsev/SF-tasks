var extarnalCustomersService = require("*/cartridge/scripts/externalCustomersService.js");

function createUser(id, formInfo) {
    return extarnalCustomersService.externalCustomersService({
        url: `/customers`,
        body: {
            id: id,
            firstName: formInfo.firstName,
            lastName: formInfo.lastName,
            phone: formInfo.phone,
            email: formInfo.email,
            password: formInfo.password,
        },
    });
}

function updateUserData(id, formInfo) {
    return extarnalCustomersService.externalCustomersService({
        method: "PATCH",
        url: `/customers/${id}`,
        body: {
            firstName: formInfo.firstName,
            lastName: formInfo.lastName,
            phone: formInfo.phone,
            email: formInfo.email,
        },
    });
}

function createAddress(addressId, formInfo) {
    return extarnalCustomersService.externalCustomersService({
        url: `/addressBook`,
        body: {
            id: addressId,
            addressId: formInfo.addressId,
            firstName: formInfo.firstName,
            lastName: formInfo.lastName,
            address1: formInfo.address1,
            address2: formInfo.address2,
            county: formInfo.county,
            stateCode: formInfo.states.stateCode,
            city: formInfo.city,
            postalCode: formInfo.postalCode,
            phone: formInfo.phone,
        },
    });
}

function updateAddress(id, formInfo) {
    return extarnalCustomersService.externalCustomersService({
        method: "PATCH",
        url: `/addressBook/${id}`,
        body: {
            addressId: formInfo.addressId,
            firstName: formInfo.firstName,
            lastName: formInfo.lastName,
            address1: formInfo.address1,
            address2: formInfo.address2,
            county: formInfo.county,
            stateCode: formInfo.states.stateCode,
            city: formInfo.city,
            postalCode: formInfo.postalCode,
            phone: formInfo.phone,
        },
    });
}

function addShippingAndBillingAddresses(billingAddress, shippingAddress) {
    return extarnalCustomersService.externalCustomersService({
        url: `/shippingAndBillingAddress`,
        body: {
            billingAddress: {
                address1: billingAddress.address1,
                address2: billingAddress.address2,
                city: billingAddress.city,
                customerFullName: billingAddress.fullName,
                customerPhone: billingAddress.phone,
                postalCode: billingAddress.postalCode,
                countryCode: billingAddress.countryCode,
            },
            shippingAddress: {
                address1: shippingAddress.address1,
                address2: shippingAddress.address2,
                city: shippingAddress.city,
                customerFullName: shippingAddress.fullName,
                customerPhone: shippingAddress.phone,
                postalCode: shippingAddress.postalCode,
                countryCode: shippingAddress.countryCode,
            },
        },
    });
}

module.exports = {
    createUser: createUser,
    updateUserData,
    createAddress: createAddress,
    updateAddress: updateAddress,
    addShippingAndBillingAddresses: addShippingAndBillingAddresses,
};
