import gatherer from "./youtube/gatherer.js"
import loader from "./youtube/loader.js"
import videoControls from "./youtube/video-controls.js";

async function run() {
    versions.ping().then(v=> console.log(v));
    document.body.style.zoom = 1.5;
    var videos = await gatherer.Gather();
    loader.Load(videos);
    videoControls.SetupVideoControls();
}

setTimeout(run, 2000);