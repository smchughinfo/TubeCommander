var lastVideoCount = 0;
var iterationsWithSameNumber = 0;
var videoList = [];
var resolvePromise = null

var intv = setInterval(function() {
    var curVideoList = document.querySelectorAll("[href^='/watch']");

    console.log(curVideoList.length + " | " + lastVideoCount)
    if(curVideoList.length === lastVideoCount) {
    iterationsWithSameNumber++;
    }
    lastVideoCount = curVideoList.length;

    if(iterationsWithSameNumber >= 6) {
        clearInterval(intv);
        window.youtube.scrapeVideos(videoList);
    }

    curVideoList.forEach(a => videoList.push(a.href)); // do this first because ...idk if it removes elements from the dom??? so if not first, first videos on page could get removed before you grab them

    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}, 1 * 1000);