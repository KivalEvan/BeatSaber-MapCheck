// TODO: basic parity check
// TODO: basic unrankable hit
// TODO: check for bomb reset
// TODO: rewrite staircase check
// smort
function countNote(notes) {
    let nr = 0;
    let nb = 0;
    let b = 0;
    for (let i = notes.length - 1; i >= 0; i--) {
        if (notes[i]._type == 0) nr++;
        else if (notes[i]._type == 1) nb++;
        else b++;
    }
    return {red: nr, blue: nb, bomb: b};
}

function countNoteLayer(notes, l) {
    let count = 0;
    notes.forEach(note => { if (note._type != 3 && note._lineLayer == l) count++; });
    return count;
}

function countNoteRed(notes) {
    let count = 0;
    notes.forEach(note => { if (note._type == 0) count++; });
    return count;
}

function countNoteBlue(notes) {
    let count = 0;
    notes.forEach(note => { if (note._type == 1) count++; });
    return count;
}

function countBomb(notes) {
    let count = 0;
    notes.forEach(note => { if (note._type == 3) count++; });
    return count;
}

function findEffectiveBPM(notes, bpm) {
    let EBPM = 0;
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type == 0) {
            if (lastRed) {
                if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                    EBPM = Math.max(EBPM, (bpm / ((note._time - lastRed._time) * 2)));
                }
            }
            lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                    EBPM = Math.max(EBPM, (bpm / ((note._time - lastBlue._time) * 2)));
                }
            }
            lastBlue = note;
        }
    }
    return EBPM;
}

// i am very smart
function findEffectiveBPMSwing(notes, bpm) {
    let EBPM = 0;
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type == 0) {
            if (lastRed) {
                if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                    EBPM = Math.max(EBPM, bpm / ((note._time - lastRed._time) * 2));
                    lastRed = note;
                }
            }
            else lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                    EBPM = Math.max(EBPM, bpm / ((note._time - lastBlue._time) * 2));
                    lastBlue = note;
                }
            }
            else lastBlue = note;
        }
    }
    return EBPM;
}

function getEffectiveBPMTime(notes, bpm, offset, bpmc) {
    let arr = [];
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if (note._type == 0) {
            if (lastRed) {
                if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                    EBPM = bpm / ((note._time - lastRed._time) * 2);
                }
            }
            lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                    EBPM = bpm / ((note._time - lastBlue._time) * 2);
                }
            }
            lastBlue = note;
        }
        if (EBPM > maxEBPM) arr.push(adjustTime(note._time, bpm, offset, bpmc));
    }
    if (arr.length > 0)
        return `Exceeded EBPM [${arr.length}]: ${arr.join(', ')}`;
    return '';
}

function getEffectiveBPMSwingTime(notes, bpm, offset, bpmc) {
    let arr = [];
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if (note._type == 0) {
            if (lastRed) {
                if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                    EBPM = bpm / ((note._time - lastRed._time) * 2);
                    lastRed = note;
                }
            }
            else lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                    EBPM = bpm / ((note._time - lastBlue._time) * 2);
                    lastBlue = note;
                }
            }
            else lastBlue = note;
        }
        if (EBPM > maxEBPMS) arr.push(adjustTime(note._time, bpm, offset, bpmc));
    }
    if (arr.length > 0)
        return `Exceeded EBPM (swing) [${arr.length}]: ${arr.join(', ')}`;
    return '';
}

function detectDoubleDirectional(notes, bpm, offset, bpmc) {
    let arr = [];
    let lastRed;
    let lastRedDir;
    let lastBlue;
    let lastBlueDir;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type == 0) {
            if (lastRed) {
                if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                    if (checkDD(note._cutDirection, lastRedDir)) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    lastRedDir = note._cutDirection;
                }
                else {
                    if (note._cutDirection != 8) lastRedDir = note._cutDirection;
                }
            }
            lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                    if (checkDD(note._cutDirection, lastBlueDir)) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    lastBlueDir = note._cutDirection;
                }
                else {
                    if (note._cutDirection != 8) lastBlueDir = note._cutDirection;
                }
            }
            lastBlue = note;
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    if (arr.length > 0)
        return `Double-directional [${arr.length}]: ${arr.join(', ')}`;
    return '';
}

function checkDD(n1cd, n2cd) {
    if (n1cd == 8 || n2cd == 8) return false;
    if (distance(noteCutAngle[n1cd], noteCutAngle[n2cd], 360) <= 45) return true;
    return false;
}

function detectVisionBlock(notes, bpm, offset, bpmc) {
    let arr = [];
    let lastMidL;
    let lastMidR;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (lastMidL) {
            if (toRealTime(note._time - lastMidL._time) > vBlockMin / 1000 && toRealTime(note._time - lastMidL._time) < vBlockMax / 1000) {
                if (note._lineIndex < 2) arr.push(adjustTime(note._time, bpm, offset, bpmc));
            }
            // yeet the last note if nothing else found so we dont have to perform check every note
            else if (toRealTime(note._time - lastMidL._time) >= vBlockMax / 1000) lastMidL = null;
        }
        if (lastMidR) {
            if (toRealTime(note._time - lastMidR._time) > vBlockMin / 1000 && toRealTime(note._time - lastMidR._time) < vBlockMax / 1000) {
                if (note._lineIndex > 1) arr.push(adjustTime(note._time, bpm, offset, bpmc));
            }
            else if (toRealTime(note._time - lastMidR._time) >= vBlockMax / 1000) lastMidR = null;
        }
        if (note._lineLayer == 1 && note._lineIndex == 1) lastMidL = note;
        else if (note._lineLayer == 1 && note._lineIndex == 2) lastMidR = note;
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    if (arr.length > 0)
        return `Vision block [${arr.length}]: ${arr.join(', ')}`;
    return '';
}

function detectOffPrecision(notes, bpm, offset, bpmc) {
    let arr = [];
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const noteTime = adjustTime(note._time, bpm, offset, bpmc);
        if (note._type == 0) {
            if (lastRed) {
                if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                    if (checkPrec(noteTime)) arr.push(noteTime);
                    lastRed = note;
                }
            }
            else {
                if (checkPrec(noteTime)) arr.push(noteTime);
                lastRed = note;
            }
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                    if (checkPrec(noteTime)) arr.push(noteTime);
                    lastBlue = note;
                }
            }
            else {
                if (checkPrec(noteTime)) arr.push(noteTime);
                lastBlue = note;
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    if (arr.length > 0)
        return `Off-beat precision [${arr.length}]: ${arr.join(', ')}`;
    return '';
}

function checkPrec(nt) {
    if (!beatPrecision.length > 0) return false;
    for (let i = 0; i < beatPrecision.length; i++)
        if ((nt + 0.001) % (1/beatPrecision[i]) < 0.01) return false;
    return true;
}

// check if note occupies post-swing space
// also fuck dot note
// i need to rewrite this
function detectHitboxStaircase(notes, bpm, offset, bpmc) {
    let arr = [];
    let lastRed;
    let lastBlue;
    let redIndexOccupy;
    let redLayerOccupy;
    let blueIndexOccupy;
    let blueLayerOccupy;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type == 0) {
            if (lastRed) { // nested if moment
                if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                    if (lastBlue) {
                        if (note._time - lastBlue._time != 0 && (note._time - lastBlue._time) / bpm * 60 < hitboxStaircaseThreshold) {
                            if (note._lineIndex == blueIndexOccupy && note._lineLayer == blueLayerOccupy) {
                                arr.push(adjustTime(note._time, bpm, offset, bpmc));
                            }
                        }
                    }
                } // honestly what the fuck am i doing?
                if (note._cutDirection != 8) {
                    redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                }
                else { // fuck dot note
                    if (maybeWindowed(note, lastRed) && checkTolerance(note, lastRed, maxWindowTolerance) || checkTolerance(note, lastRed, maxTolerance)) {
                        redIndexOccupy = -1;
                        redLayerOccupy = -1;
                    }
                    else {
                        redIndexOccupy = note._lineIndex + swingCutDirectionSpace[lastRed._cutDirection][0];
                        redLayerOccupy = note._lineLayer + swingCutDirectionSpace[lastRed._cutDirection][1];
                    }
                }
            }
            else { // first note
                if (note._cutDirection != 8) {
                    redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                }
                else { // dot note is ambiguous
                    redIndexOccupy = -1;
                    redLayerOccupy = -1;
                }
            }
            lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                    if (lastRed) {
                        if (note._time - lastRed._time != 0 && (note._time - lastRed._time) / bpm * 60 < hitboxStaircaseThreshold) {
                            if (note._lineIndex == redIndexOccupy && note._lineLayer == redLayerOccupy) {
                                arr.push(adjustTime(note._time, bpm, offset, bpmc));
                            }
                        }
                    }
                }
                if (note._cutDirection != 8) {
                    blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                }
                else {
                    if (maybeWindowed(note, lastBlue) && checkTolerance(note, lastBlue, maxWindowTolerance) || checkTolerance(note, lastBlue, maxTolerance)) {
                        blueIndexOccupy = -1;
                        blueLayerOccupy = -1;
                    }
                    else {
                        blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[lastBlue._cutDirection][0];
                        blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[lastBlue._cutDirection][1];
                    }
                }
            }
            else {
                if (note._cutDirection != 8) {
                    blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                }
                else {
                    blueIndexOccupy = -1;
                    blueLayerOccupy = -1;
                }
            }
            lastBlue = note;
        }
    }
    if (arr.length > 0)
        return `Hitbox staircase [${arr.length}]: ${arr.join(', ')}`;
     return '';
}

const swingCutDirectionSpace = {
    0: [0, 1],
    1: [0, -1],
    2: [-1, 0],
    3: [1, 0],
    4: [-1, 1],
    5: [1, 1],
    6: [-1, -1],
    7: [1, -1],
    8: [0, 0]
}

// fuck end note stack checking or some shit
// fuck dot note
// i prolly need to extend further
// also unused
function checkEndNote(note1, note2) {
    let vertical = false;
    let horizontal = false;
    // up
    if (note2._cutDirection == 4 || note2._cutDirection == 0 || note2._cutDirection == 5) {
        if (note1._lineLayer < note2._lineLayer) {
            vertical = true;
        }
    }
    // down
    else if (note2._cutDirection == 6 || note2._cutDirection == 1 || note2._cutDirection == 7) {
        if (note1._lineLayer > note2._lineLayer) {
            vertical = true;
        }
    }
    // left
    if (note2._cutDirection == 4 || note2._cutDirection == 2 || note2._cutDirection == 6) {
        if (note1._lineIndex < note2._lineIndex) {
            horizontal = true;
        }
    }
    // right
    else if (note2._cutDirection == 5 || note2._cutDirection == 3 || note2._cutDirection == 7) {
        if (note1._lineIndex > note2._lineIndex) {
            horizontal = true;
        }
    }
    if (vertical || horizontal)
        return true;
    return false;
}
