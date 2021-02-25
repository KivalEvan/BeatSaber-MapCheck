/* GENERIC SCRIPT - generic.js
    for map related that has no place or general map stuff
    the more i look at this the more pepega it becomes */

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
    if (notes[0]._time < 0) return `${round(notes[0]._time, 3)} (${round((60 / bpm) * notes[0]._time, 2)}s)`;
    return '';
}

function findOutEndNote(notes, bpm) {
    if (!notes.length > 0) return '';
    let endBeat = (map.audio.duration * bpm) / 60;
    if (notes[notes.length - 1]._time > endBeat)
        return `${round(notes[notes.length - 1]._time, 3)} (${round((60 / bpm) * notes[notes.length - 1]._time, 2)}s)`;
    return '';
}

function findOutStartObstacle(obstacles, bpm) {
    if (!obstacles.length > 0) return '';
    if (obstacles[0]._time < 0) return `${round(obstacles[0]._time, 3)} (${round((60 / bpm) * obstacles[0]._time, 2)}s)`;
    return '';
}

function findOutEndObstacle(obstacles, bpm) {
    if (!obstacles.length > 0) return '';
    let endBeat = (map.audio.duration * bpm) / 60;
    if (obstacles[obstacles.length - 1]._time > endBeat)
        return `${round(obstacles[obstacles.length - 1]._time, 3)} (${round(
            (60 / bpm) * obstacles[obstacles.length - 1]._time,
            2
        )}s)`;
    return '';
}

function findOutStartEvent(events, bpm) {
    if (!events.length > 0) return '';
    if (events[0]._time < 0) return `${round(events[0]._time, 3)} (${round((60 / bpm) * events[0]._time, 2)}s)`;
    return '';
}

function findOutEndEvent(events, bpm) {
    if (!events.length > 0) return '';
    let endBeat = (map.audio.duration * bpm) / 60;
    if (events[events.length - 1]._time > endBeat)
        return `${round(events[events.length - 1]._time, 3)} (${round((60 / bpm) * events[events.length - 1]._time, 2)}s)`;
    return '';
}

function calcNPS(nc) {
    return nc / map.audio.duration;
}

function calcNPSMapped(nc, dur) {
    if (!dur) return 0;
    return nc / dur;
}

/* hardcoded stuff but whatever
    thx XAce1337manX#9170 for the info
    also modified a bit to be more reasonable
              W  I
    1 diff:  33 99
    2 diffs: 16 50
    3 diffs: 11 34
    4 diffs:  8 25
    5 diffs:  6 20 */
function checkLabelLength(mapChar, lbl) {
    let char = map.info._difficultyBeatmapSets.find((c) => c._beatmapCharacteristicName === mapChar);
    diffCount = char._difficultyBeatmaps.length;
    switch (diffCount) {
        case 1:
            if (lbl.length > 90) return 'error';
            if (lbl.length > 39) return 'warn';
            break;
        case 2:
            if (lbl.length > 42) return 'error';
            if (lbl.length > 21) return 'warn';
            break;
        case 3:
            if (lbl.length > 27) return 'error';
            if (lbl.length > 15) return 'warn';
            break;
        case 4:
            if (lbl.length > 20) return 'error';
            if (lbl.length > 11) return 'warn';
            break;
        case 5:
            if (lbl.length > 17) return 'error';
            if (lbl.length > 8) return 'warn';
            break;
    }
}

// unlike map duration, this starts from the first interactive object
// had to be done, thx Uninstaller
function getFirstInteractiveTime(diff, bpm) {
    const { _notes: notes, _obstacles: obstacles } = diff;
    let firstNoteTime = Number.MAX_VALUE;
    if (notes.length > 0) firstNoteTime = (notes[0]._time / bpm) * 60;
    const firstInteractiveObstacleTime = findFirstInteractiveObstacleTime(obstacles, bpm);
    return Math.min(firstNoteTime, firstInteractiveObstacleTime);
}

function getLastInteractiveTime(diff, bpm) {
    const { _notes: notes, _obstacles: obstacles } = diff;
    let lastNoteTime = 0;
    if (notes.length > 0) lastNoteTime = (notes[notes.length - 1]._time / bpm) * 60;
    const lastInteractiveObstacleTime = findLastInteractiveObstacleTime(obstacles, bpm);
    return Math.max(lastNoteTime, lastInteractiveObstacleTime);
}

function findFirstInteractiveObstacleTime(obstacles, bpm) {
    for (let i = 0, len = obstacles.length; i < len; i++)
        if (obstacles[i]._width >= 2 || obstacles[i]._lineIndex === 1 || obstacles[i]._lineIndex === 2)
            return (obstacles[i]._time / bpm) * 60;
    return Number.MAX_VALUE;
}

function findLastInteractiveObstacleTime(obstacles, bpm) {
    let obstacleEnd = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width >= 2 || obstacles[i]._lineIndex === 1 || obstacles[i]._lineIndex === 2)
            obstacleEnd = Math.max(obstacleEnd, ((obstacles[i]._time + obstacles[i]._duration) / bpm) * 60);
    return obstacleEnd;
}
