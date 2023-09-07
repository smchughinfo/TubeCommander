function setupVideoControls() {
    $(window).on("click", event => {
        if($(event.target).is(".video-thumbnail")) {
            youtube.openVideo($(event.target).attr("video-id"));
        }
    });
}

export default {
    SetupVideoControls: setupVideoControls
}