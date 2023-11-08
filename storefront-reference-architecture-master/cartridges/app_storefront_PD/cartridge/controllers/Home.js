const server = require("server");
const HookMgr = require("dw/system/HookMgr");
const page = module.superModule;
server.extend(page);

server.replace("Show", (req, res, next) => {
    let viewData = res.getViewData();
    viewData.title = "SFRA";
    res.setViewData(viewData);
    next();
});
module.exports = server.exports();
