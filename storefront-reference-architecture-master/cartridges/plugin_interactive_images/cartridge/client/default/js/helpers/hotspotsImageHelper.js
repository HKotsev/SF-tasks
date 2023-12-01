
'use strict';
var breakpoints = require('../config/breakpoints.json').breakpoints;

function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

/**
 * PLP Categories carousel
 * @return {void}
 */
function setHotspotsImageSrc() {
        var images = document.querySelectorAll('.hotspot-src-element');
        if(images){
            try {
                var componentSettings = parent.document.querySelector('.component-settings');
                var iframe = componentSettings.querySelector('iframe').contentDocument;

                var imgWrapper = iframe.querySelector('.hotspots-display');
                for (let index = 0; index < images.length; index++) {
                    var currentImage = images[index];
                    let image = document.createElement('span');
                    setAttributes(image, {"src": currentImage.getAttribute('src'), "type": currentImage.getAttribute('type'), name: currentImage.getAttribute('name'), "hotspots": currentImage.getAttribute('hotspots')});
                    imgWrapper.append(image);
                }
            } catch (error) {
                // do not log anything
            }
        }
}

function adjustHotspotTilePosition($hotspotEl){
    var centerOfScreenValue = 50;

    var leftPosition = parseFloat($hotspotEl.css('left')) * 100 / $('.hotspot-image-wrapper').width();
    if (leftPosition > centerOfScreenValue){
        $hotspotEl.children('.hotspot-product').addClass('flip-hotspot-product-left');
    } else{
        $hotspotEl.children('.hotspot-product').removeClass('flip-hotspot-product-left');
    }
}

function initProductHotspots() {
    if ($('.hotspot-image').is(':visible')) {
        $('.hotspot-image').siblings('.hotspot').removeClass('d-none');
    }

    $('body').on('click', '.hotspot', (e) => {
        var $hotspotEl = $(e.target);

        // hide all open products
        $('.expand-hotspot').not($hotspotEl).removeClass('expand-hotspot');

        if($(window).width() >= breakpoints.desktop){
            adjustHotspotTilePosition($hotspotEl);
        }

        $hotspotEl.toggleClass('expand-hotspot');
    })
}

module.exports = {
    setHotspotsImageSrc: setHotspotsImageSrc,
    initProductHotspots: initProductHotspots
};
