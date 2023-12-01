
// Code in the client-side JavaScript file for the trigger editor
(() => {
    let container = document.createElement('div');
    let hotspotsDisplay = document.createElement('span');
    let currentValue = {};

    function renderHotspots(hotspots) {
        var hotspotHtml = '';
        hotspots.forEach((hotspot, index) => {
            hotspotHtml += `<span class="hotspot-breakout-marker" data-index="${index + 1} - " style="display: block; margin-top: 5px; margin-left: 15px">${hotspot[2]}</span>`;
        });

        return hotspotHtml;
    }

    function showCreatedHotspots(currentValue) {
        if (currentValue.images) {
            // remove exisiting markers
            let hotspotsContainer = document.querySelector('.hotspots-container');
            if (hotspotsContainer) {
                hotspotsContainer.parentNode.removeChild(hotspotsContainer);
            }

            // create new container with new images and hotspots
            hotspotsContainer = document.createElement('div');
            hotspotsContainer.className = 'hotspots-container';
            for (let index = 0; index < currentValue.images.length; index++) {
                var element = currentValue.images[index];
                var elementType = element.type;
                var imageStrIndex = elementType.indexOf('Image');
                var deviceType = imageStrIndex > -1 ? elementType.substr(0, imageStrIndex) : elementType;

                let hotspotInfo = document.createElement('span');
                hotspotInfo.style.display = 'block';
                hotspotInfo.style.padding = '2px 5px';
                hotspotInfo.innerHTML = `<span class="hotspot-header">${deviceType} hotspots:</span> ${element.hotspots.length > 0 ? renderHotspots(element.hotspots) : '<span style="display: block; color: red;">No hotspots created yet</span>'}`;
                hotspotsContainer.appendChild(hotspotInfo);

            }
            document.body.appendChild(hotspotsContainer);
        }
    }

    subscribe('sfcc:ready', async ({ value, ...rest }) => {
        let button = document.createElement('button');
        button.setAttribute('class', 'slds-button slds-button_outline-brand btn btn-secondary mb-3');
        button.innerHTML = 'Create Hotspots';
        button.onclick = handleBreakoutOpen;

        let warning = document.createElement('div');
        warning.setAttribute('class', 'alert alert-warning mt-3 text-uppercase text-center');
        warning.innerHTML = 'Please save the changes before and after creating hotspots!';

        hotspotsDisplay.className = 'hotspots-display';
        currentValue = value ? value : {};

        document.body.appendChild(warning);
        document.body.appendChild(button);
        document.body.appendChild(hotspotsDisplay);
        document.body.appendChild(container);


        showCreatedHotspots(currentValue);
    });

    subscribe('sfcc:value', async ({ breakout, ...rest }) => {
        const applyButtonEl = document.querySelector('.slds-button_brand');
        const { id } = breakout;
        applyButtonEl.addEventListener('click', () => handleBreakoutApply(id));
    });

    function updatePageDesignerValue(value) {
        emit({
            type: 'sfcc:value',
            payload: value
        });
    }

    function handleBreakoutOpen(value) {
        var imgWrapper = document.querySelector('.hotspots-display');

        for (let index = 0; index < imgWrapper.children.length; index++) {
            var currentImage = imgWrapper.children[index];
            var imageType = currentImage.getAttribute('type');
            var imageSrc = currentImage.getAttribute('src');

            if (Object.hasOwnProperty.call(currentValue, 'images') && currentValue.images && currentValue.images.length > 0) {
                // find the matching image with type
                var foundImage = currentValue.images.filter(function (image) {
                    return image.type === imageType;
                });

                if (foundImage && foundImage.length > 0) {
                    currentValue.images.forEach(function (image) {
                        if (image.type === imageType && foundImage[0].src !== imageSrc) {
                            // image source has changed, remove the hotspots and update the image source
                            image.hotspots = [];
                            image.src = imageSrc;
                        }
                    });
                } else {
                    currentValue.images.push({
                        src: imageSrc,
                        type: imageType,
                        displayText: currentImage.getAttribute('name'),
                        hotspots: []
                    });
                }
            } else {
                if (!Object.hasOwnProperty.call(currentValue, 'images')) {
                    currentValue.images = [];
                }

                var hotspots = currentImage.getAttribute('hotspots');
                try {
                    hotspots = JSON.parse(hotspots);
                } catch (e) {
                    hotspots = [];
                }

                currentValue.images.push(
                    {
                        src: currentImage.getAttribute('src'),
                        type: currentImage.getAttribute('type'),
                        displayText: currentImage.getAttribute('name'),
                        hotspots: hotspots,
                    });
            }
        }

        updatePageDesignerValue(currentValue);

        emit({
            type: 'sfcc:breakout',
            payload: {
                id: 'imageHotspotsEditorBreakoutScript',
                title: 'Set up hotspots',
                value: currentValue
            }
        }, handleBreakoutClose);
    }

    function handleBreakoutClose({ type, value }) {
        // Now the "value" can be passed back to Page Designer
        if (type === 'sfcc:breakoutApply') {
            handleBreakoutApply(value);
        } else {
            handleBreakoutCancel();
        }
    }

    function handleBreakoutCancel() {
    }

    function handleBreakoutApply(value) {
        currentValue = Object.assign({}, value);
        updatePageDesignerValue(currentValue);
        showCreatedHotspots(currentValue);
    }
})();
