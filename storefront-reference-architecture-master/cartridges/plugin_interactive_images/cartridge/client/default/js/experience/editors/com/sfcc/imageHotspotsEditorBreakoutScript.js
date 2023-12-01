(() => {
    var hotspotIdCounter = 1;
    var paneHotspotCounter = {
        desktopImage: 1,
        tabletImage: 1,
        mobileImage: 1,
    };
    var currentValue = {};
    var hotspotListClass = "hotspot-list";

    var flexWrapper = document.createElement("div");
    flexWrapper.classList.add("flex-container", "row");

    // left buttons
    var navigationButtonsWrapper = document.createElement("div");
    navigationButtonsWrapper.classList.add(
        "col-2",
        "d-flex",
        "flex-column",
        "align-items-center",
        "border-right",
        "pt-5"
    );
    flexWrapper.appendChild(navigationButtonsWrapper);

    // image section
    var imagesWrapper = document.createElement("div");
    imagesWrapper.classList.add(
        "col-7",
        "d-flex",
        "flex-column",
        "align-items-center",
        "border-right"
    );
    flexWrapper.appendChild(imagesWrapper);

    // right hotspots list
    var hotspotsListWrapper = document.createElement("div");
    hotspotsListWrapper.classList.add(
        "col-3",
        "hotspots-list-wrapper",
        "d-flex",
        "flex-column",
        "align-items-center"
    );
    flexWrapper.appendChild(hotspotsListWrapper);

    document.body.appendChild(flexWrapper);

    function placeHotspot(
        imgHeight,
        imgWidth,
        clientX,
        clientY,
        parsed,
        imgWrapper,
        selectedHotspotsList,
        currentImage,
        productId,
        updateHotspots
    ) {
        if (productId) {
            var coordX = parsed
                ? clientX
                : parseFloat(100 * (clientX / imgWidth)).toFixed(2) + "%";
            var coordY = parsed
                ? clientY
                : parseFloat(100 * (clientY / imgHeight)).toFixed(2) + "%";
            var hotSpotItem = document.createElement("li");
            var deleteHotSpotButton = document.createElement("span");
            var hotspot = document.createElement("div");
            var currentHotspotArray = [coordX, coordY, productId];
            var currentHotspotValue = currentHotspotArray.join(",");
            var imageType = currentImage.type || "";
            var hotspotCounter = Object.hasOwnProperty.call(
                paneHotspotCounter,
                imageType
            )
                ? paneHotspotCounter[imageType]
                : 1;

            var id = "hotspot-" + hotspotIdCounter;
            hotspot.className =
                "position-absolute rounded-circle border hotspot";
            hotspot.id = id;

            hotSpotItem.className = hotspotListClass;

            hotspot.dataset.count = hotspotCounter;
            hotSpotItem.dataset.count = `${hotspotCounter} - `;

            deleteHotSpotButton.dataset.id = id;
            deleteHotSpotButton.className = "delete-hotspot js-close";
            deleteHotSpotButton.dataset.hotspot = currentHotspotValue;
            deleteHotSpotButton.dataset.type = currentImage.type;

            currentImage.className =
                "list-group-item d-flex justify-content-between align-items-center";

            hotSpotItem.innerHTML = `<span>Product: ${productId}</span>`;
            hotSpotItem.dataset.coord = [coordX, coordY].join(",");
            hotSpotItem.dataset.productId = productId;

            hotspot.style = "top:" + coordY + ";left:" + coordX + ";";

            imgWrapper.appendChild(hotspot);
            hotSpotItem.appendChild(deleteHotSpotButton);
            selectedHotspotsList.appendChild(hotSpotItem);
            hotspotIdCounter++;
            paneHotspotCounter[imageType]++;

            deleteHotSpotButton.addEventListener("click", function () {
                this.closest("li").remove();
                var dataID = this.dataset.id;
                var toDeleteHotSpot = this.dataset.hotspot;
                var toDeleteFromImageType = this.dataset.type;
                document.getElementById(dataID).remove();

                // remove from the currentValue
                for (
                    let index = 0;
                    index < currentValue.images.length;
                    index++
                ) {
                    const image = currentValue.images[index];
                    if (image.type === toDeleteFromImageType) {
                        var hotspots = currentValue.images[index].hotspots;

                        var hotSpotIndex = hotspots
                            .map((hotspot) => {
                                return hotspot.join(",");
                            })
                            .indexOf(toDeleteHotSpot);

                        if (hotSpotIndex > -1) {
                            hotspots.splice(hotSpotIndex, 1);
                            currentValue.images[index].hotspots = hotspots;

                            submitHotpsotSelections();
                            paneHotspotCounter[imageType]--;
                        }
                    }
                }
            });

            // update the hotspot value in the host
            if (updateHotspots) {
                for (
                    let index = 0;
                    index < currentValue.images.length;
                    index++
                ) {
                    const image = currentValue.images[index];
                    if (image.type === currentImage.type) {
                        currentValue.images[index].hotspots.push(
                            currentHotspotArray
                        );
                        submitHotpsotSelections();
                    }
                }
            }
        }
    }

    function toggleVisibility(type, addedClass, removedClass) {
        var elemntsToHide = document.querySelectorAll(`.${type}`);
        elemntsToHide.forEach((element) => {
            element.classList.add(addedClass);
            element.classList.remove(removedClass);
        });
    }

    function handleImageSelection(currentButton, showHideImagesButtons) {
        var imageToShow = document.getElementById(currentButton.type);
        var displayedClass = "displayed";
        var hiddenClass = "hidden";

        for (let index = 0; index < showHideImagesButtons.length; index++) {
            var image = showHideImagesButtons[index];

            if (image.type != imageToShow.getAttribute("id")) {
                toggleVisibility(image.type, hiddenClass, displayedClass);
            }
        }

        toggleVisibility(currentButton.type, displayedClass, hiddenClass);

        var buttons = document.querySelectorAll(".show-hide-image-button");
        buttons.forEach((button) => {
            button.classList.remove("btn-success");
        });

        currentButton.domElement.classList.add("btn-success");
    }

    function submitHotpsotSelections() {
        emit({
            type: "sfcc:value",
            payload: currentValue,
        });
    }

    function createHotspotInfoContainerDOMElements(currentImage) {
        var imgElement = document.createElement("img");
        var selectedHotspotsList = document.createElement("ul");
        var hotspotsValueTitle = document.createElement("p");

        hotspotsValueTitle.classList.add(
            "hotspots-info-title",
            "text-uppercase",
            "font-weight-bold",
            "pt-5"
        );
        hotspotsValueTitle.innerHTML = `Selected hotspots for ${currentImage.displayText}:`;

        selectedHotspotsList.className = `list-group py-1 ul-${currentImage.type}`;

        var imgWrapper = document.createElement("div");
        imgWrapper.setAttribute("id", currentImage.type);
        imgWrapper.classList.add(
            "img-wrapper",
            currentImage.type,
            "visib-hidden"
        );

        let hotspots = currentImage.hotspots ? currentImage.hotspots : [];
        imgElement.src = currentImage.src ? currentImage.src : "";
        imgWrapper.appendChild(imgElement);
        imgWrapper.appendChild(imgElement);

        var imgHeight;
        var imgWidth;

        var imageHotspotInfoWrapper = document.createElement("div");
        imageHotspotInfoWrapper.classList.add(
            "float-right",
            "hidden",
            "hotspot-info-wrapper",
            currentImage.type
        );
        imageHotspotInfoWrapper.appendChild(hotspotsValueTitle);
        imageHotspotInfoWrapper.appendChild(selectedHotspotsList);

        hotspotsListWrapper.appendChild(imageHotspotInfoWrapper);

        imgElement.addEventListener("load", function () {
            imgHeight = this.clientHeight;
            imgWidth = this.clientWidth;
            imgWrapper.classList.add("hidden");

            if (hotspots && hotspots.length > 0) {
                hotspots.forEach(function (hotspot) {
                    placeHotspot(
                        imgHeight,
                        imgWidth,
                        hotspot[0],
                        hotspot[1],
                        true,
                        imgWrapper,
                        selectedHotspotsList,
                        currentImage,
                        hotspot[2]
                    );
                });
            }
        });

        function setHotSpot(productPicker) {
            var clickEvent = this;
            var bounds = clickEvent.target.getBoundingClientRect();
            var x = clickEvent.clientX - bounds.left;
            var y = clickEvent.clientY - bounds.top;
            placeHotspot(
                imgHeight,
                imgWidth,
                x,
                y,
                false,
                imgWrapper,
                selectedHotspotsList,
                currentImage,
                productPicker.value.value,
                true
            );
        }

        imgElement.addEventListener("click", function (e) {
            emit(
                {
                    type: "sfcc:breakout",
                    payload: {
                        id: "sfcc:productPicker",
                    },
                },
                setHotSpot.bind(e)
            );
        });

        imagesWrapper.appendChild(imgWrapper);
    }

    function createNavigationDOMElements() {
        var loadMobileImage = document.createElement("button");
        var loadDesktopImage = document.createElement("button");
        var loadTabletImage = document.createElement("button");

        var showHideImagesButtons = [
            {
                type: "desktopImage",
                text: "Load desktop image",
                domElement: loadDesktopImage,
            },
            {
                type: "tabletImage",
                text: "Load tablet image",
                domElement: loadTabletImage,
            },
            {
                type: "mobileImage",
                text: "Load mobile image",
                domElement: loadMobileImage,
            },
        ];

        for (let index = 0; index < showHideImagesButtons.length; index++) {
            var currentButton = showHideImagesButtons[index];
            navigationButtonsWrapper.appendChild(currentButton.domElement);
            currentButton.domElement.className = `show-hide-image-button btn btn-secondary w-75 text-uppercase button-${currentButton.type}`;
            currentButton.domElement.innerHTML = currentButton.text;

            currentButton.domElement.addEventListener(
                "click",
                handleImageSelection.bind(
                    this,
                    currentButton,
                    showHideImagesButtons
                )
            );
        }
    }

    subscribe("sfcc:ready", async (value) => {
        currentValue = Object.assign({}, value.value);

        createNavigationDOMElements();

        var imageTypes = [];
        currentValue.images.forEach((currentImage) => {
            currentImage.hotspots =
                !currentImage.hotspots || currentImage.hotspots === "null"
                    ? []
                    : currentImage.hotspots;
            createHotspotInfoContainerDOMElements(currentImage);
            imageTypes.push(currentImage.type);
        });

        var showFirstElement = document.querySelectorAll(`.${imageTypes[0]}`);
        showFirstElement.forEach((element) => {
            element.classList.add("displayed");
        });

        document
            .querySelector(`.button-${imageTypes[0]}`)
            .classList.add("btn-success");
    });
})();
