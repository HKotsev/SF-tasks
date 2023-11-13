var server = require("server");
var cache = require("*/cartridge/scripts/middleware/cache");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");
const page = module.superModule;
server.extend(page);

server.replace(
    "Show",
    consentTracking.consent,
    cache.applyDefaultCache,
    function (req, res, next) {
        var Site = require("dw/system/Site");
        var PageMgr = require("dw/experience/PageMgr");
        var pageMetaHelper = require("*/cartridge/scripts/helpers/pageMetaHelper");
        var Resource = require("dw/web/Resource");

        var pageDesignerId =
            Site.current.preferences.custom.pageDesignerHomepage;

        pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

        var page = PageMgr.getPage(pageDesignerId);

        if (page && page.isVisible()) {
            res.page(pageDesignerId);
        } else {
            res.render("home/homePage");
        }
        next();
    },
    pageMetaData.computedPageMetaData
);
module.exports = server.exports();
