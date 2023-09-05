const fs = require("fs");
const path = require('path');
const installHelper = require('./install-helper.js');
installHelper.CreateSecretFileTemplateIfNotExist();
installHelper.CreateUpdateScriptIfNotExist();
const ipc = require("./ipc.js")
const windowManager = require("./window-manager.js")
const eventEmitter = require('events');

// TV COMMANDER
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! whats this do?



var cachedVideosPath = path.join(__dirname, "cache/cachedVideo.txt");
var cachedVideoIdsPath = path.join(__dirname, "cache/cachedVideosIDs.txt");

var rescrape = true;
//rescrape = false;  // <----------- TOGGLE THIS ONE
rescrape = rescrape || (!fs.existsSync(cachedVideosPath) && !fs.existsSync(cachedVideoIdsPath)) // but it will always rescrape if cached files dont exist
var myEmitter = new eventEmitter();
var window = null;

if(rescrape) {
    windowManager.CreateWindow('https://www.youtube.com', true).then(win => {
        window = win;
        ipc.SetupIPC(myEmitter, window);
    });        
}
else {
    windowManager.CreateWindow('front-end/index.html', true).then(win => {
        window = win;7
        ipc.SetupIPC(myEmitter, window, true);
    });
}

myEmitter.on("youtube-scraped", () => {
    window.loadFile('front-end/index.html')
});