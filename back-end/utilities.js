const moment = require('moment');

function getYoutubeVideoId(url) {
    var nv = url.replace(/^.*?v=/, "");
    return nv.replace(/&.*/, "");
}


function convertISO8601ToObject(duration) {
    try {
        let match = duration.match(/P(?:([0-9]+)D)?T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/);
        let days = parseInt(match[1]) || 0;
        let hours = parseInt(match[2]) || 0;
        let minutes = parseInt(match[3]) || 0;
        let seconds = parseInt(match[4]) || 0;
        return { days, hours, minutes, seconds }
    }
    catch { // live videos (and others?) throw exception
        return {
            days:0, hours:0, minutes:0, seconds:0
        }
    }
}

function convertISO8601ToHumanReadableDuration(duration) {
    var d = convertISO8601ToObject(duration);
    
    let readable = [];
    
    if (d.days > 0) readable.push(`${d.days} day${d.days === 1 ? '' : 's'}`);
    if (d.hours > 0) readable.push(`${d.hours} hour${d.hours === 1 ? '' : 's'}`);
    if (d.minutes > 0) readable.push(`${d.minutes} minute${d.minutes === 1 ? '' : 's'}`);
    if (d.seconds > 0) readable.push(`${d.seconds} second${d.seconds === 1 ? '' : 's'}`);
    
    return readable.join(', ');
}

function convertISO8601ToSeconds(duration) {
    var d = convertISO8601ToObject(duration);
    const daysToSeconds = d.days * 24 * 60 * 60;
    const hoursToSeconds = d.hours * 60 * 60;
    const minutesToSeconds = d.minutes * 60;
    const totalSeconds = daysToSeconds + hoursToSeconds + minutesToSeconds + d.seconds;
    
    return totalSeconds;
}
      

module.exports = {
    GetYoutubeVideoId: getYoutubeVideoId,
    ConvertISO8601ToHumanReadableDuration: convertISO8601ToHumanReadableDuration,
    ConvertISO8601ToSeconds: convertISO8601ToSeconds
}