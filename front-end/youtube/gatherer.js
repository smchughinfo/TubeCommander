import counter from "../utilities/counter.js"

function updateSuggestionCounts(suggestedVideos) {
    suggestedVideos.forEach(suggestedVideo => {
        counter.IncrementCount(suggestedVideo);
    });
}

async function gather() {
    var suggestedVideoIds = await window.youtube.getSuggestedVideos();
    updateSuggestionCounts(suggestedVideoIds);
    return await window.youtube.getVideoDetails(suggestedVideoIds);
}

export default {
    Gather: gather
}