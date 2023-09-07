var counts = localStorage.counts === undefined ? [] : JSON.parse(localStorage.counts);

function incrementCount(id) {
    var countObject = counts.find(c => c.id === id);
    if(countObject) {
        countObject.count++;
    }
    else {
        counts.push({
            id: id,
            count: 1
        });
    }
    
    localStorage.counts = JSON.stringify(counts);
}

function getCount(id) {
    return counts.find(c => c.id).count;
}

export default {
    IncrementCount: incrementCount,
    GetCount: getCount
}