const { ipcMain } = require('electron')
const youtube = require("./youtube.js")
const fs = require("fs");
const utils = require("./utilities.js")
const path = require('path');
const { spawn, exec } = require('child_process');

var cachedVideoIdsPath = path.join(__dirname, "cache/cachedVideosIDs.txt");

function setupIPC(eventEmitter, win, useCached) {
    ipcMain.handle('ping', () => __dirname);
    ipcMain.handle('youtube-search', async (event, queryParams) => {
        return await youtube.Search(queryParams);
    });
    ipcMain.handle('youtube-save-scraped-videos', (event, videos) => {
        uniqueVideos = [...new Set(videos)];
        uniqueVideos = uniqueVideos.map(utils.GetYoutubeVideoId);

        fs.writeFileSync(cachedVideoIdsPath, JSON.stringify(uniqueVideos));
        eventEmitter.emit("youtube-scraped")
    });
    ipcMain.handle('youtube-get-videos', (events) => {
        return JSON.parse(fs.readFileSync(cachedVideoIdsPath));
    });
    ipcMain.handle('youtube-get-video-details', async (event, videos) => {
        return await youtube.GetVideoDetails(videos);
    });
    ipcMain.handle('youtube-get-video-id', (event, videoUrl) => {
        return utils.getYoutubeVideoId(videoUrl);
    });
    ipcMain.handle('settings-update', () => {
        var batchFilePath = "C:\\TubeCommander\\update.bat";
        spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/K', batchFilePath]);
        process.exit();
    });
    ipcMain.handle('youtube-open-video', (event, videoId) => {
        exec('firefox.exe -new-tab https://youtube.com/watch?v=' + videoId);
    });
}

module.exports = {
    SetupIPC: setupIPC
}