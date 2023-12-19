module.exports = {
    addressTypeChange: function () {
        const radioButtons = document.querySelectorAll('.js-form-radio-button');
        const businessAddress = document.querySelector('.js-business-address');
        const displayNone = 'd-none';
        const privateAddressString = 'Private Address';
        const businessAddressString = 'Business Address';

        radioButtons.forEach(radioButton => {
            radioButton.onchange = () => {

                const addressType = radioButton.value;

                switch (addressType) {
                    case privateAddressString:
                        businessAddress.classList.add(displayNone);
                        break;
                    case businessAddressString:
                        businessAddress.classList.remove(displayNone);
                        break;
                }
            }
        });
    }
}

