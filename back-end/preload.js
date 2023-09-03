const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
});

contextBridge.exposeInMainWorld('youtube', {
  search: queryParams => ipcRenderer.invoke("youtube-search", queryParams),
  scrapeVideos: videos => ipcRenderer.invoke("youtube-save-scraped-videos", videos),
  getSuggestedVideos: () => ipcRenderer.invoke("youtube-get-videos"),
  getVideoDetails: videoIds => ipcRenderer.invoke("youtube-get-video-details", videoIds),
  getVideoId: videoUrl => ipcRenderer.invoke("youtube-get-video-id", videoUrl)
});