const { ipcMain } = require('electron')
const youtube = require("./youtube.js")
const fs = require("fs");
const utils = require("./utilities.js")

function setupIPC(eventEmitter, win, useCached) {
    ipcMain.handle('ping', () => 'pong');
    ipcMain.handle('youtube-search', async (event, queryParams) => {
        return await youtube.Search(queryParams);
    });
    ipcMain.handle('youtube-save-scraped-videos', (event, videos) => {
        uniqueVideos = [...new Set(videos)];
        uniqueVideos = uniqueVideos.map(utils.GetYoutubeVideoId);
        fs.writeFileSync("cachedVideosIDs.txt", JSON.stringify(uniqueVideos));
        eventEmitter.emit("youtube-scraped")
    });
    ipcMain.handle('youtube-get-videos', (events) => {
        return JSON.parse(fs.readFileSync("cachedVideosIDs.txt"));
    });
    ipcMain.handle('youtube-get-video-details', async (event, videos) => {
        return await youtube.GetVideoDetails(videos);
    });
    ipcMain.handle('youtube-get-video-id', (event, videoUrl) => {
        return utils.getYoutubeVideoId(videoUrl);
    });
}

module.exports = {
    SetupIPC: setupIPC
}