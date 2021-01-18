// TODO: extensive lighting stats?

function countEventLight(events) {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--)
        if (events[i]._type != 14 || events[i]._type != 15)
            count++;
    return count;
}
function countEventRotation(events) {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--)
        if (events[i]._type == 14 || events[i]._type == 15)
            count++;
    return count;
}
function countEventChroma(events) {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--)
        if (events[i]._customData)
            count++;
    return count;
}