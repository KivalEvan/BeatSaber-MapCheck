 /* NOTE SCRIPT - note.js
    note pattern detection and stuff idk
    TODO: basic parity check
    TODO: basic unrankable hit
    TODO: rewrite staircase check */

// smort
function getNoteCount(notes) {
    let nr = 0;
    let nb = 0;
    let b = 0;
    for (let i = notes.length - 1; i >= 0; i--) {
        if (notes[i]._type === 0) nr++;
        else if (notes[i]._type === 1) nb++;
        else b++;
    }
    return {red: nr, blue: nb, bomb: b};
}
function countNoteLayer(notes, l) {
    let count = 0;
    notes.forEach(note => { if (note._type !== 3 && note._lineLayer === l) count++; });
    return count;
}
function countNoteIndex(notes, i) {
    let count = 0;
    notes.forEach(note => { if (note._type !== 3 && note._lineIndex === i) count++; });
    return count;
}

function findEffectiveBPM(notes, bpm) {
    let EBPM = 0;
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    EBPM = Math.max(EBPM, (bpm / ((note._time - lastRed._time) * 2)));
                }
            }
            lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
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
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    EBPM = Math.max(EBPM, bpm / ((note._time - lastRed._time) * 2));
                    lastRed = note;
                }
            }
            else lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    EBPM = Math.max(EBPM, bpm / ((note._time - lastBlue._time) * 2));
                    lastBlue = note;
                }
            }
            else lastBlue = note;
        }
    }
    return EBPM;
}

function getEffectiveBPMTime(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    EBPM = bpm / ((note._time - lastRed._time) * 2);
                }
            }
            lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    EBPM = bpm / ((note._time - lastBlue._time) * 2);
                }
            }
            lastBlue = note;
        }
        if (EBPM > tool.ebpm.th) arr.push(adjustTime(note._time, bpm, offset, bpmc));
    }
    return arr;
}

function getEffectiveBPMSwingTime(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    EBPM = bpm / ((note._time - lastRed._time) * 2);
                    lastRed = note;
                }
            }
            else lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    EBPM = bpm / ((note._time - lastBlue._time) * 2);
                    lastBlue = note;
                }
            }
            else lastBlue = note;
        }
        if (EBPM > tool.ebpm.thSwing) arr.push(adjustTime(note._time, bpm, offset, bpmc));
    }
    return arr;
}

function detectDoubleDirectional(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastRed;
    let lastRedDir;
    let startRedDot;
    let lastBlue;
    let lastBlueDir;
    let startBlueDot;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    if (startRedDot) {
                        startRedDot = null;
                        lastRedDir = flipCutDir[lastRedDir];
                    }
                    if (checkDD(note._cutDirection, lastRedDir)) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    if (note._cutDirection === 8) startRedDot = note;
                    else lastRedDir = note._cutDirection;
                }
                else {
                    if (startRedDot && checkDD(note._cutDirection, lastRedDir)) {
                        arr.push(adjustTime(startRedDot._time, bpm, offset, bpmc));
                        startRedDot = null;
                        lastRedDir = note._cutDirection;
                    }
                    if (note._cutDirection !== 8) {
                        startRedDot = null;
                        lastRedDir = note._cutDirection;
                    };
                }
            }
            else lastRedDir = note._cutDirection;
            lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (startBlueDot) {
                        startBlueDot = null;
                        lastBlueDir = flipCutDir[lastBlueDir];
                    }
                    if (checkDD(note._cutDirection, lastBlueDir)) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    if (note._cutDirection === 8) startBlueDot = note;
                    else lastBlueDir = note._cutDirection;
                }
                else {
                    if (startBlueDot && checkDD(note._cutDirection, lastBlueDir)) {
                        arr.push(adjustTime(startBlueDot._time, bpm, offset, bpmc));
                        startBlueDot = null;
                        lastBlueDir = note._cutDirection;
                    }
                    if (note._cutDirection !== 8) {
                        startBlueDot = null;
                        lastBlueDir = note._cutDirection;
                    }
                }
            }
            else lastBlueDir = note._cutDirection;
            lastBlue = note;
        } else if (note._type === 3) {
            // on bottom row
            if (note._lineLayer === 0) {
                //on right center
                if (note._lineIndex === 1) {
                    lastRedDir = 0;
                    startRedDot = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastBlueDir = 0;
                    startBlueDot = null;
                }
            //on top row
            } else if (note._lineLayer === 2) {
                //on right center
                if (note._lineIndex === 1) {
                    lastRedDir = 1;
                    startRedDot = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastBlueDir = 1;
                    startBlueDot = null;
                }
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

function checkDD(n1cd, n2cd) {
    if (n1cd === 8 || n2cd === 8) return false;
    if (distance(noteCutAngle[n1cd], noteCutAngle[n2cd], 360) <= 45) return true;
    return false;
}

function detectVisionBlock(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastMidL;
    let lastMidR;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (lastMidL) {
            if (isAboveTH(note._time - lastMidL._time, tool.vb.min) && isBelowTH(note._time - lastMidL._time, tool.vb.max)) {
                if (note._lineIndex < 2) arr.push(adjustTime(note._time, bpm, offset, bpmc));
            }
            // yeet the last note if nothing else found so we dont have to perform check every note
            else if (toRealTime(note._time - lastMidL._time) >= tool.vb.max) lastMidL = null;
        }
        if (lastMidR) {
            if (isAboveTH(note._time - lastMidR._time, tool.vb.min) && isBelowTH(note._time - lastMidR._time, tool.vb.max)) {
                if (note._lineIndex > 1) arr.push(adjustTime(note._time, bpm, offset, bpmc));
            }
            else if (toRealTime(note._time - lastMidR._time) >= tool.vb.max) lastMidR = null;
        }
        if (note._lineLayer === 1 && note._lineIndex === 1) lastMidL = note;
        else if (note._lineLayer === 1 && note._lineIndex === 2) lastMidR = note;
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

function detectOffPrecision(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const noteTime = adjustTime(note._time, bpm, offset, bpmc);
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    if (checkPrec(noteTime)) arr.push(noteTime);
                    lastRed = note;
                }
            }
            else {
                if (checkPrec(noteTime)) arr.push(noteTime);
                lastRed = note;
            }
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
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
        return !i || x !== ary[i - 1];
    });
    return arr;
}

function checkPrec(nt) {
    if (!tool.beatPrec.length > 0) return false;
    for (let i = 0; i < tool.beatPrec.length; i++)
        if ((nt + 0.001) % (1/tool.beatPrec[i]) < 0.01) return false;
    return true;
}

function checkEndNote(n1, n2) {
    // fuck u and ur dot note stack
    if (n1._cutDirection === 8 && n2._cutDirection === 8) return false;
    // if end note on right side
    if (n1._lineIndex > n2._lineIndex) {
        // check if end note is arrowed
        if (n1._cutDirection === 5 || n1._cutDirection === 3 || n1._cutDirection === 7) {
            return true;
        }
        // check if end note is dot and start arrow is pointing to it
        if ((n2._cutDirection === 5 || n2._cutDirection === 3 || n2._cutDirection === 7) && n1._cutDirection === 8) {
            return true;
        }
    }
    // if end note on left side
    if (n1._lineIndex < n2._lineIndex) {
        if (n1._cutDirection === 6 || n1._cutDirection === 2 || n1._cutDirection === 4) {
            return true;
        }
        if ((n2._cutDirection === 6 || n2._cutDirection === 2 || n2._cutDirection === 4) && n1._cutDirection === 8) {
            return true;
        }
    }
    // if end note is above
    if (n1._lineLayer > n2._lineLayer) {
        if (n1._cutDirection === 4 || n1._cutDirection === 0 || n1._cutDirection === 5) {
            return true;
        }
        if ((n2._cutDirection === 4 || n2._cutDirection === 0 || n2._cutDirection === 5) && n1._cutDirection === 8) {
            return true;
        }
    }
    // if end note is below
    if (n1._lineLayer < n2._lineLayer) {
        if (n1._cutDirection === 6 || n1._cutDirection === 1 || n1._cutDirection === 7) {
            return true;
        }
        if ((n2._cutDirection === 6 || n2._cutDirection === 1 || n2._cutDirection === 7) && n1._cutDirection === 8) {
            return true;
        }
    }
    return false;
}

// check if note occupies post-swing space
// also fuck dot note
// i need to rewrite this
function detectHitboxStaircase(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastRed;
    let lastBlue;
    let redIndexOccupy;
    let redLayerOccupy;
    let blueIndexOccupy;
    let blueLayerOccupy;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) { // nested if moment
                if (swingNext(note, lastRed)) {
                    if (lastBlue && note._time - lastBlue._time !== 0 && isBelowTH(note._time - lastBlue._time, tool.hitbox.staircase)) {
                        if (note._lineIndex === blueIndexOccupy && note._lineLayer === blueLayerOccupy) {
                            arr.push(adjustTime(note._time, bpm, offset, bpmc));
                        }
                    }
                    if (note._cutDirection !== 8) {
                        redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    } else { // no dot note >:(
                        redIndexOccupy = -1;
                        redLayerOccupy = -1;
                    }
                }
                else if (checkEndNote(note, lastRed)) {
                    if (note._cutDirection !== 8) {
                        redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    }
                    else { // re
                        redIndexOccupy = note._lineIndex + swingCutDirectionSpace[lastRed._cutDirection][0];
                        redLayerOccupy = note._lineLayer + swingCutDirectionSpace[lastRed._cutDirection][1];
                    }
                }
            } else {
                if (note._cutDirection !== 8) {
                    redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                } else { // dot note is ambiguous
                    redIndexOccupy = -1;
                    redLayerOccupy = -1;
                }
            }
            lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (lastRed && note._time - lastRed._time !== 0 && isBelowTH(note._time - lastRed._time, tool.hitbox.staircase)) {
                        if (note._lineIndex === redIndexOccupy && note._lineLayer === redLayerOccupy) {
                            arr.push(adjustTime(note._time, bpm, offset, bpmc));
                        }
                    }
                    if (note._cutDirection !== 8) {
                        blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    } else {
                        blueIndexOccupy = -1;
                        blueLayerOccupy = -1;
                    }
                }
                else if (checkEndNote(note, lastBlue)) {
                    if (note._cutDirection !== 8) {
                        blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    }
                    else {
                        blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[lastBlue._cutDirection][0];
                        blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[lastBlue._cutDirection][1];
                    }
                }
            } else {
                if (note._cutDirection !== 8) {
                    blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                } else {
                    blueIndexOccupy = -1;
                    blueLayerOccupy = -1;
                }
            }
            lastBlue = note;
        }
    }
    return arr;
}

function detectShrAngle(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastRed;
    let lastRedDir;
    let startRedDot;
    let lastBlue;
    let lastBlueDir;
    let startBlueDot;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    if (startRedDot) {
                        startRedDot = null;
                        lastRedDir = flipCutDir[lastRedDir];
                    }
                    if (checkShrAngle(note._cutDirection, lastRedDir) && isBelowTH(note._time - lastRed._time, tool.maxShrAngle + 0.01)) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    if (note._cutDirection === 8) startRedDot = note;
                    else lastRedDir = note._cutDirection;
                }
                else {
                    if (startRedDot && checkShrAngle(note._cutDirection, lastRedDir) && isBelowTH(note._time - lastRed._time, tool.maxShrAngle + 0.01)) {
                        arr.push(adjustTime(startRedDot._time, bpm, offset, bpmc));
                        startRedDot = null;
                    }
                    if (note._cutDirection !== 8) lastRedDir = note._cutDirection;
                }
            }
            else lastRedDir = note._cutDirection;
            lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (startBlueDot) {
                        startBlueDot = null;
                        lastBlueDir = flipCutDir[lastBlueDir];
                    }
                    if (checkShrAngle(note._cutDirection, lastBlueDir) && isBelowTH(note, lastBlue, tool.maxShrAngle + 0.01)) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    if (note._cutDirection === 8) startBlueDot = note;
                    else lastBlueDir = note._cutDirection;
                }
                else {
                    if (startBlueDot && checkShrAngle(note._cutDirection, lastBlueDir) && isBelowTH(note, lastBlue, tool.maxShrAngle + 0.01)) {
                        arr.push(adjustTime(startBlueDot._time, bpm, offset, bpmc));
                        startBlueDot = null;
                    }
                    if (note._cutDirection !== 8) lastBlueDir = note._cutDirection;
                }
            }
            else lastBlueDir = note._cutDirection;
            lastBlue = note;
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

function checkShrAngle(n1cd, n2cd) {
    if (n1cd === 8 || n2cd === 8) return false;
    if ((n2cd === 6 || n2cd === 7) && n1cd === 0) return true;
    return false;
}

function detectStackedNote(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastTime;
    for (let i = 0, len = notes.length; i < len; i++) {
        if (toRealTime(notes[i]._time) < lastTime + tool.stack) continue;
        for (let j = i+1; j < len; j++) {
            if (toRealTime(notes[j]._time) > toRealTime(notes[i]._time) + tool.stack) break;
            if (notes[i]._lineLayer === notes[j]._lineLayer && notes[i]._lineIndex === notes[j]._lineIndex) {
                arr.push(adjustTime(notes[i]._time, bpm, offset, bpmc));
                lastTime = toRealTime(notes[i]._time);
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

// im having pain pls help
// idk how this work but it does
function detectSpeedPause(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let lastRed;
    let lastRedPause;
    let lastBlue;
    let lastBluePause;
    let maybePauseRed = false;
    let maybePauseBlue = false;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    if (isBelowTH(note._time - lastRed._time, tool.maxSpeedPause * 2 + 0.01)) {
                        if (maybePauseBlue && maybePauseRed && isBelowTH(lastRed._time - lastRedPause._time, tool.maxSpeedPause * 3 + 0.01)) {
                            arr.push(adjustTime(lastRed._time, bpm, offset, bpmc));
                        }
                        maybePauseRed = false;
                    } else if (!maybePauseRed) {
                        maybePauseRed = true;
                        lastRedPause = lastRed;
                    }
                    lastRed = note;
                }
            }
            else lastRed = note;
        }
        else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (isBelowTH(note._time - lastBlue._time, tool.maxSpeedPause * 2 + 0.01)) {
                        if (maybePauseBlue && maybePauseRed && isBelowTH(lastBlue._time - lastBluePause._time, tool.maxSpeedPause * 3 + 0.01)) {
                            arr.push(adjustTime(lastBlue._time, bpm, offset, bpmc));
                        }
                        maybePauseBlue = false;
                    } else if (!maybePauseBlue) {
                        maybePauseBlue = true;
                        lastBluePause = lastBlue;
                    }
                    lastBlue = note;
                }
            }
            else lastBlue = note;
        }
    }
    return arr;
}
