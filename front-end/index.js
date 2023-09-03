import gatherer from "./youtube/gatherer.js"
import loader from "./youtube/loader.js"

async function run() {
    document.body.style.zoom = 1.5;
    var videos = await gatherer.Gather();
    loader.Load(videos);
}

setTimeout(run, 2000);