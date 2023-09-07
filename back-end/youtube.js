const {google} = require('googleapis');
const fs = require("fs");
const { channel } = require('diagnostics_channel');

// Each API may support multiple versions. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.
let authKey = fs.readFileSync("C:\\TubeCommander\\secrets.json")
authKey = JSON.parse(authKey)
authKey = authKey["google-api-key"];

const youtube = google.youtube({
    version: 'v3',
    auth: authKey  
})

function formatThumbnails(thumbnails) {
    var result = [];
    if(thumbnails.default) {
        thumbnails.default.name = "default";
        result.push(thumbnails.default);
    }
    if(thumbnails.medium) {
        thumbnails.medium.name = "medium";
        result.push(thumbnails.medium);
    }
    if(thumbnails.high) {
        thumbnails.high.name = "high";
        result.push(thumbnails.high);
    }
    if(thumbnails.standard) {
        thumbnails.standard.name = "standard";
        result.push(thumbnails.standard);
    }
    if(thumbnails.maxres) {
        thumbnails.maxres.name = "maxres";
        result.push(thumbnails.maxres);
    }
    return result;
}

const order = {
    Date: "date",
    Rating: "rating",
    Relevance: "relevance",
    ViewCount: "viewCount"
}

const duration = {
    Any: "any",
    GreaterThan20Minutes: "long",
    Between4And20Minutes: "medium",
    LessThan4Minutes: "short"
}

async function search(queryParams) {
    var videos = await list(queryParams.query, queryParams.order, queryParams.duration);
    var ids = videos.map(v => v.videoId);
    var details = await getVideoDetails(ids);
    videos.forEach(video => {
        let videoDetail = details.filter(d => d.id == video.videoId)[0];
        video.duration = videoDetail.duration;
    });
    return videos;
}

async function GetChannelInfo(channelIds) {
    var results = [];

    for(var i = 0;i*50 < channelIds.length; i++) {
        var chunk = channelIds.slice(i*50, (i+1)*50);
        var response = await youtube.channels.list({
            id: chunk.join(","),
            part: "snippet,contentDetails,statistics",
            maxResults: 50
        });
        response.data.items.forEach(r => {
            r.snippet.thumbnails = formatThumbnails(r.snippet.thumbnails);
        })
        results = results.concat(response.data.items);
    }
    
    return results;
}

/*
// https://developers.google.com/youtube/v3/docs/search/list#usage
async function  list(query, order, duration) {
    var params = {
        part: "snippet",
        q: query,
        maxResults: 50,
        safeSearch: "none",
        type: "video"
        };
*/

// https://developers.google.com/youtube/v3/docs/search/list#usage
async function  list(query, order, duration) {
    var params = {
        part: "snippet",
        q: query,
        maxResults: 50,
        safeSearch: "none",
        type: "video"
        };
    if(params.order) {
        params.order = order
    }
    if(params.duration) {
        params.duration = duration
    }
    var response = await youtube.search.list(params)
    var result = response.data.items.map(v => {
        return {
            videoId: v.id.videoId,
            thumbnails: formatThumbnails(v.snippet.thumbnails),
            publishDate: v.snippet.publishTime,
            channelTitle: v.snippet.channelTitle,
            channelId: v.snippet.channelId,
            description: v.snippet.description,
            title: v.snippet.title
        }
    });
    return result;
}

// https://developers.google.com/youtube/v3/docs/videos/list
// can do a max of 50
async function getVideoDetails(videoIdList) {
    var results = [];
    
    var done = 0;
    while(true) {
        var batchIdList = videoIdList.slice(done, done + 50);
        var response = await youtube.videos.list({
            part: "snippet,contentDetails,statistics",
            id: batchIdList.join(",")
        });
        results = results.concat(response.data.items);

        done += 50;
        if(done >= videoIdList.length) {
            var channelIds = results.map(r => r.snippet.channelId);
            var uniqueChannelIds = [...new Set(channelIds)];
            var channels = await GetChannelInfo(uniqueChannelIds);
            results.forEach(r => {
                r.snippet.thumbnails = formatThumbnails(r.snippet.thumbnails);
                r.channel = channels.find(c => c.id == r.snippet.channelId)
            });
            break;
        }
    }
    
    return results;
}

  module.exports = {
    Order: order,
    Duration: duration,
    Search: search,
    GetVideoDetails: getVideoDetails
  }