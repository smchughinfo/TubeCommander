var videoList = null;
var chunkSize = 16;

function load(videos) {
    videoList = videos;
    loadNextChunk(0);
}

const videoContainer = {
    get videosLoaded() {
        return document.querySelectorAll("#videoContainer > *");
    }
};

function allVideosLoaded() {
    return videoContainer.videosLoaded.length >= videoList.length;
}

var loadsDone = 0;
function loadNextChunk() {
    var $videoContainer = $("#videoContainer");
    
    var chunk = videoList.slice(videoContainer.videosLoaded.length, (loadsDone + 1) * chunkSize);
    chunk.forEach(video => {
        var videoHtml = document.getElementById("videoPrototype").outerHTML.replace("VIDEO-ID", video.id).replace("id=\"videoPrototype\"", "");
        var $videoElm = $(videoHtml);
        $videoContainer.append($videoElm);
    });
    loadsDone++;
}

function handleScrollToBottom() {
    var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    var pageHeight = document.documentElement.scrollHeight;
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (scrollY + windowHeight >= pageHeight) {
        loadNextChunk();

        if(allVideosLoaded()) {
            window.removeEventListener("scroll", handleScrollToBottom);
        }
    }
}
window.addEventListener("scroll", handleScrollToBottom);

export default {
    Load: load
}