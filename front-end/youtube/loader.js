import counter from "../utilities/counter.js"

var videoList = null;
var chunkSize = 16;

function load(videos) {
    videoList = videos;
    orderVideoList();
    loadNextChunk(0);
}

function orderVideoList() {
    videoList = videoList.sort((a, b) => {
        return counter.GetCount(a.id) - counter.GetCount(b.id); // ascending
    });
    videoList.forEach(v => {
        v.count = counter.GetCount(v.id);
    });
}

const videoContainer = {
    get videosLoaded() {
        return document.querySelectorAll("#videoContainer > *");
    }
};

function allVideosLoaded() {
    return videoContainer.videosLoaded.length >= videoList.length;
}

function loadVideo(video) {
    var videoThumbnailUrl = video.snippet.thumbnails[video.snippet.thumbnails.length - 1].url;
    var channelThumbnailUrl = video.channel.snippet.thumbnails[0].url;
    
    var $video = $("<div class='col-3 video-container' style='margin-top:30px;'>\
                        <img video-id='" + video.id + "' class='video-thumbnail' src='" + videoThumbnailUrl + "'>\
                        <div class='col'>\
                            <img class='channel-thumbnail' src='" + channelThumbnailUrl + "'>\
                            <div style='position:absolute;top:-22px;left:55px;'>" + video.snippet.channelTitle + "</div>\
                        </div>\
                        <div class='col' style='flex-grow:2'>\
                            <div class='col-12'>\
                                <div>" + video.snippet.title + "</div>\
                                <div style='width: 100%;max-height: 30px;whitespace:wrap;font-size:10px;font-style:italic;overflow:hidden;'>" + video.snippet.description + "</div>\
                            </div>\
                        </div>\
                    </div>"
                );
    /*var videoHtml = document.getElementById("videoPrototype").outerHTML.replace("VIDEO-ID", video.id).replace("id=\"videoPrototype\"", "");
    var $videoElm = $(videoHtml);*/
    $("#videoContainer").append($video);
}

var loadsDone = 0;
function loadNextChunk() {
    var chunk = videoList.slice(videoContainer.videosLoaded.length, (loadsDone + 1) * chunkSize);
    chunk.forEach(loadVideo);
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