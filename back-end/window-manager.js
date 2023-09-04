const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const fs = require("fs");

function configureWindow(uri, dev) {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            contentSecurityPolicy: "default-src 'self' 'unsafe-inline'"
        }
    })

    win.maximize();
    setupContextMenu(win);

    var isYoutubeUrl = uri.indexOf("youtube") !== -1;
    if(isYoutubeUrl) {
        win.loadURL(uri);
        setupYoutubeScraper(win)
    }
    else {
        win.loadFile(uri);
    }
    
    if(dev === true) {
        win.webContents.openDevTools();
    }

    return win;
}

function setupYoutubeScraper(win) {
    win.webContents.on('did-finish-load', () => {
        var isYoutubeUrl = win.getURL().indexOf("youtube") !== -1;
        if(isYoutubeUrl) {
            const filePath = path.join(__dirname, '../front-end/utilities/scraper.js');
            const customScript = fs.readFileSync(filePath);
            win.webContents.executeJavaScript(customScript)
        }
    });
}

function setupContextMenu(win) {
    const contextMenuTemplate = [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        {
            label: 'Inspect Element',
            click: () => {
                win.webContents.inspectElement(contextMenuParams.x, contextMenuParams.y);
            }
        }
    ];

    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

    win.webContents.on('context-menu', (event, params) => {
        contextMenuParams = params;
        contextMenu.popup({ window: win });
    });
}

function createWindow(uri, dev) {
    var createWindowPromise = new Promise((resolve) => {
        app.whenReady().then(() => {
            resolve(configureWindow(uri, dev));
        
            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    resolve(configureWindow(uri, dev));
                }
            });
        });
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    return createWindowPromise;
}

module.exports = {
    CreateWindow: createWindow
}