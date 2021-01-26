 /* GENERIC SCRIPT - generic.js
    for map related that has no place or general map stuff
    the more i look at this the more pepega it becomes */

function checkHotStart(notes, obstacles, bpm) {
    if (getFirstInteractiveTime(notes, obstacles, bpm) < 1.5) return true;
    return false;
}

function getHalfJumpDuration(bpm, njs, offset) {
    const maxHalfJump = 18;
    
    const noteJumpMovementSpeed = (njs * bpm) / bpm;
    const num = 60 / bpm;
    let hjd = 4;
    while (noteJumpMovementSpeed * num * hjd > maxHalfJump) {
        hjd /= 2;
    }
    hjd += offset;
    if (hjd < 1) {
        hjd = 1;
    }

    return hjd;
}

function getJumpDistance(bpm, njs, offset) {
    return njs * (60 / bpm) * getHalfJumpDuration(bpm, njs, offset) * 2;
}

function findOutStartNote(notes, bpm) {
    if (!notes.length > 0) return '';
    if (notes[0]._time < 0)
        return `${round(notes[0]._time, 3)} (${round(60 / bpm * notes[0]._time, 2)}s)`;
    return '';
}

function findOutEndNote(notes, bpm) {
    if (!notes.length > 0) return '';
    let endBeat = songDuration * bpm / 60;
    if (notes[notes.length - 1]._time > endBeat)
        return `${round(notes[notes.length - 1]._time, 3)} (${round(60 / bpm * notes[notes.length - 1]._time, 2)}s)`;
    return '';
}

function findOutStartObstacle(obstacles, bpm) {
    if (!obstacles.length > 0) return '';
    if (obstacles[0]._time < 0)
        return `${round(obstacles[0]._time, 3)} (${round(60 / bpm * obstacles[0]._time, 2)}s)`;
    return '';
}

function findOutEndObstacle(obstacles, bpm) {
    if (!obstacles.length > 0) return '';
    let endBeat = songDuration * bpm / 60;
    if (obstacles[obstacles.length - 1]._time > endBeat)
        return `${round(obstacles[obstacles.length - 1]._time, 3)} (${round(60 / bpm * obstacles[obstacles.length - 1]._time, 2)}s)`;
    return '';
}

function findOutStartEvent(events, bpm) {
    if (!events.length > 0) return '';
    if (events[0]._time < 0)
        return `${round(events[0]._time, 3)} (${round(60 / bpm * events[0]._time, 2)}s)`;
    return '';
}

function findOutEndEvent(events, bpm) {
    if (!events.length > 0) return '';
    let endBeat = songDuration * bpm / 60;
    if (events[events.length - 1]._time > endBeat)
        return `${round(events[events.length - 1]._time, 3)} (${round(60 / bpm * events[events.length - 1]._time, 2)}s)`;
    return '';
}

function calcNPS(nc) {
    return nc / songDuration;
}

function calcNPSMapped(nc, dur) {
    if (!dur) return 0;
    return nc / dur;
}

// unlike map duration, this starts from the first interactive object
// had to be done, thx Uninstaller
function getFirstInteractiveTime(notes, obstacles, bpm) {
    let firstNoteTime = Number.MAX_VALUE;
    if (notes.length > 0) firstNoteTime = notes[0]._time / bpm * 60;
    const firstInteractiveObstacleTime = findFirstInteractiveObstacleTime(obstacles, bpm);
    return Math.min(firstNoteTime, firstInteractiveObstacleTime);
}

function getLastInteractiveTime(notes, obstacles, bpm) {
    let lastNoteTime = 0;
    if (notes.length > 0) lastNoteTime = notes[notes.length - 1]._time / bpm * 60;
    const lastInteractiveObstacleTime = findLastInteractiveObstacleTime(obstacles, bpm);
    return Math.max(lastNoteTime, lastInteractiveObstacleTime);
}

function findFirstInteractiveObstacleTime(obstacles, bpm) {
    for (let i = 0, len = obstacles.length; i < len; i++)
        if (obstacles[i]._width >= 2 || obstacles[i]._lineIndex == 1 || obstacles[i]._lineIndex == 2)
            return obstacles[i]._time / bpm * 60;
    return Number.MAX_VALUE;
}

function findLastInteractiveObstacleTime(obstacles, bpm) {
    let obstacleEnd = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width >= 2 || obstacles[i]._lineIndex == 1 || obstacles[i]._lineIndex == 2)
            obstacleEnd = Math.max(obstacleEnd, (obstacles[i]._time + obstacles[i]._duration) / bpm * 60);
    return obstacleEnd;
}
