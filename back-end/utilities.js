function getYoutubeVideoId(url) {
    var nv = url.replace(/^.*?v=/, "");
    return nv.replace(/&.*/, "");
}

module.exports = {
    getYoutubeVideoId: getYoutubeVideoId
}