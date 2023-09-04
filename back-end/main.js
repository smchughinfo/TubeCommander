const ipc = require("./ipc.js")
const windowManager = require("./window-manager.js")
const fs = require("fs");
const eventEmitter = require('events');
// TV COMMANDER
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! whats this do?

var rescrape = true;
//rescrape = false;  // <----------- TOGGLE THIS ONE
rescrape = rescrape || (!fs.existsSync("cachedVideos.txt") && !fs.existsSync("cachedVideosIDs.txt")) // but it will always rescrape if cached files dont exist

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