/* NOTE SCRIPT - note.js
    note pattern detection and stuff idk
    TODO: basic parity check
    TODO: basic unrankable hit */

// smort
function getNoteCount(notes) {
    const noteCount = { red: 0, blue: 0, bomb: 0, chromaN: 0, chromaB: 0 };
    for (let i = notes.length - 1; i >= 0; i--) {
        if (notes[i]._type === 0) {
            noteCount.red++;
            if (notes[i]._type._customData?._color) {
                noteCount.chromaN++;
            }
        } else if (notes[i]._type === 1) {
            noteCount.blue++;
            if (notes[i]._type._customData?._color) {
                noteCount.chromaN++;
            }
        } else if (notes[i]._type === 3) {
            noteCount.bomb++;
            if (notes[i]._type._customData?._color) {
                noteCount.chromaB++;
            }
        }
    }
    return noteCount;
}
function countNoteIndex(notes, i) {
    let count = 0;
    notes.forEach((note) => {
        if (note._type !== 3 && note._lineIndex === i) {
            count++;
        }
    });
    return count;
}
function countNoteLayer(notes, l) {
    let count = 0;
    notes.forEach((note) => {
        if (note._type !== 3 && note._lineLayer === l) {
            count++;
        }
    });
    return count;
}
function countNoteIndexLayer(notes, i, l) {
    let count = 0;
    notes.forEach((note) => {
        if (note._type !== 3 && note._lineIndex === i && note._lineLayer === l) {
            count++;
        }
    });
    return count;
}

function findEffectiveBPM(notes, bpm) {
    let EBPM = 0;
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                EBPM = Math.max(EBPM, bpm / ((note._time - lastNote[note._type]._time) * 2));
            }
        }
        lastNote[note._type] = note;
    }
    return EBPM;
}
// i am very smart
function findEffectiveBPMSwing(notes, bpm) {
    let EBPM = 0;
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                EBPM = Math.max(EBPM, bpm / ((note._time - lastNote[note._type]._time) * 2));
                lastNote[note._type] = note;
            }
        } else {
            lastNote[note._type] = note;
        }
    }
    return EBPM;
}
function getEffectiveBPMTime(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                EBPM = bpm / ((note._time - lastNote[note._type]._time) * 2);
            }
        }
        lastNote[note._type] = note;
        if (EBPM > tool.ebpm.th) {
            arr.push(adjustTime(note._time, bpm, offset, bpmc));
        }
    }
    return arr;
}
function getEffectiveBPMSwingTime(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                EBPM = bpm / ((note._time - lastNote[note._type]._time) * 2);
                lastNote[note._type] = note;
            }
        } else {
            lastNote[note._type] = note;
        }
        if (EBPM > tool.ebpm.thSwing) {
            arr.push(adjustTime(note._time, bpm, offset, bpmc));
        }
    }
    return arr;
}
function getMinSliderSpeed(notes) {
    const sliderSpeed = {
        0: 0,
        1: 0,
        3: 0,
    };
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (!swingNext(note, lastNote[note._type])) {
                sliderSpeed[note._type] = Math.max(
                    sliderSpeed[note._type],
                    toRealTime(note._time - lastNote[note._type]._time) / (swingWindow(note, lastNote[note._type]) ? 2 : 1)
                );
            }
            lastNote[note._type] = note;
        } else {
            lastNote[note._type] = note;
        }
        lastNote[note._type] = note;
    }
    return Math.max(sliderSpeed[0], sliderSpeed[1]);
}
function getMaxSliderSpeed(notes) {
    const sliderSpeed = {
        0: Number.MAX_SAFE_INTEGER,
        1: Number.MAX_SAFE_INTEGER,
        3: Number.MAX_SAFE_INTEGER,
    };
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (!swingNext(note, lastNote[note._type]) && toRealTime(note._time - lastNote[note._type]._time) > 0.001) {
                sliderSpeed[note._type] = Math.min(
                    sliderSpeed[note._type],
                    toRealTime(note._time - lastNote[note._type]._time) / (swingWindow(note, lastNote[note._type]) ? 2 : 1)
                );
            }
            lastNote[note._type] = note;
        } else {
            lastNote[note._type] = note;
        }
    }
    return Math.min(sliderSpeed[0], sliderSpeed[1]);
}

function detectDoubleDirectional(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    const lastNoteDirection = {
        0: null,
        1: null,
        3: null,
    };
    const startNoteDot = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = flipCutDir[lastNoteDirection[note._type]];
                }
                if (checkDD(note._cutDirection, lastNoteDirection[note._type])) {
                    arr.push(adjustTime(note._time, bpm, offset, bpmc));
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note._type] = note;
                } else {
                    lastNoteDirection[note._type] = note._cutDirection;
                }
            } else {
                if (startNoteDot[note._type] && checkDD(note._cutDirection, lastNoteDirection[note._type])) {
                    arr.push(adjustTime(startNoteDot[note._type]._time, bpm, offset, bpmc));
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = note._cutDirection;
                }
                if (note._cutDirection !== 8) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = note._cutDirection;
                }
            }
        } else {
            lastNoteDirection[note._type] = note._cutDirection;
        }
        lastNote[note._type] = note;
        if (note._type === 3) {
            // on bottom row
            if (note._lineLayer === 0) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteDirection[0] = 0;
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteDirection[1] = 0;
                    startNoteDot[1] = null;
                }
                //on top row
            } else if (note._lineLayer === 2) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteDirection[0] = 1;
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteDirection[1] = 1;
                    startNoteDot[1] = null;
                }
            }
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
function checkDD(n1cd, n2cd) {
    if (n1cd === 8 || n2cd === 8) {
        return false;
    }
    if (distance(noteCutAngle[n1cd], noteCutAngle[n2cd], 360) <= 45) {
        return true;
    }
    return false;
}

function detectVisionBlock(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { diffName, hjd, bpm, bpmc, offset } = mapSettings;
    const arr = [];
    let lastMidL;
    let lastMidR;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (lastMidL) {
            if (
                isAboveThres(
                    note._time - lastMidL._time,
                    flag.tool.vbSpecific === 'time' ? tool.vb.min : tool.vb.diff[diffName].min
                ) &&
                isBelowThres(
                    note._time - lastMidL._time,
                    flag.tool.vbSpecific === 'time' ? tool.vb.max : Math.min(toRealTime(hjd), tool.vb.diff[diffName].max)
                )
            ) {
                if (note._lineIndex < 2) {
                    arr.push(adjustTime(note._time, bpm, offset, bpmc));
                }
            }
            // yeet the last note if nothing else found so we dont have to perform check every note
            else if (
                toRealTime(note._time - lastMidL._time) >= flag.tool.vbSpecific === 'time'
                    ? tool.vb.max
                    : Math.min(toRealTime(hjd), tool.vb.diff[diffName].max)
            ) {
                lastMidL = null;
            }
        }
        if (lastMidR) {
            if (
                isAboveThres(
                    note._time - lastMidR._time,
                    flag.tool.vbSpecific === 'time' ? tool.vb.min : tool.vb.diff[diffName].min
                ) &&
                isBelowThres(
                    note._time - lastMidR._time,
                    flag.tool.vbSpecific === 'time' ? tool.vb.max : Math.min(toRealTime(hjd), tool.vb.diff[diffName].max)
                )
            ) {
                if (note._lineIndex > 1) {
                    arr.push(adjustTime(note._time, bpm, offset, bpmc));
                }
            } else if (
                toRealTime(note._time - lastMidR._time) >= flag.tool.vbSpecific === 'time'
                    ? tool.vb.max
                    : Math.min(toRealTime(hjd), tool.vb.diff[diffName].max)
            ) {
                lastMidR = null;
            }
        }
        if (note._lineLayer === 1 && note._lineIndex === 1) {
            lastMidL = note;
        }
        if (note._lineLayer === 1 && note._lineIndex === 2) {
            lastMidR = note;
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}

function detectOffPrecision(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const noteTime = adjustTime(note._time, bpm, offset, bpmc);
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                if (checkPrec(noteTime)) {
                    arr.push(noteTime);
                }
                lastNote[note._type] = note;
            }
        } else {
            if ((note._type === 0 || note._type === 1) && checkPrec(noteTime)) {
                arr.push(noteTime);
            }
            lastNote[note._type] = note;
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
function checkPrec(nt) {
    if (!tool.beatPrec.length > 0) {
        return false;
    }
    for (let i = 0; i < tool.beatPrec.length; i++) {
        if ((nt + 0.001) % (1 / tool.beatPrec[i]) < 0.01) {
            return false;
        }
    }
    return true;
}

// check if note occupies post-swing space
// also fuck dot note
// i need to rewrite this
function detectHitboxStaircase(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    let lastRed;
    let lastBlue;
    let lastSpeedRed = 0;
    let lastSpeedBlue = 0;
    let redIndexOccupy;
    let redLayerOccupy;
    let blueIndexOccupy;
    let blueLayerOccupy;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                // nested if moment
                if (swingNext(note, lastRed)) {
                    lastSpeedRed = toRealTime(note._time - lastRed._time);
                    if (note._cutDirection !== 8) {
                        redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    } else {
                        // no dot note >:(
                        redIndexOccupy = -1;
                        redLayerOccupy = -1;
                    }
                } else if (swingNoteEnd(note, lastRed)) {
                    if (note._cutDirection !== 8) {
                        redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    } else {
                        // re
                        redIndexOccupy = note._lineIndex + swingCutDirectionSpace[lastRed._cutDirection][0];
                        redLayerOccupy = note._lineLayer + swingCutDirectionSpace[lastRed._cutDirection][1];
                    }
                }
                if (
                    lastBlue &&
                    note._time - lastBlue._time !== 0 &&
                    isBelowThres(note._time - lastBlue._time, Math.min(tool.hitbox.staircase, lastSpeedBlue))
                ) {
                    if (
                        note._lineIndex === blueIndexOccupy &&
                        note._lineLayer === blueLayerOccupy &&
                        !swingNoteDouble(note, notes, i)
                    ) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                }
            } else {
                if (note._cutDirection !== 8) {
                    redIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    redLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                } else {
                    // dot note is ambiguous
                    redIndexOccupy = -1;
                    redLayerOccupy = -1;
                }
            }
            lastRed = note;
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    lastSpeedBlue = toRealTime(note._time - lastBlue._time);
                    if (note._cutDirection !== 8) {
                        blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    } else {
                        blueIndexOccupy = -1;
                        blueLayerOccupy = -1;
                    }
                } else if (swingNoteEnd(note, lastBlue)) {
                    if (note._cutDirection !== 8) {
                        blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                        blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    } else {
                        blueIndexOccupy = note._lineIndex + swingCutDirectionSpace[lastBlue._cutDirection][0];
                        blueLayerOccupy = note._lineLayer + swingCutDirectionSpace[lastBlue._cutDirection][1];
                    }
                }
                if (
                    lastRed &&
                    note._time - lastRed._time !== 0 &&
                    isBelowThres(note._time - lastRed._time, Math.min(tool.hitbox.staircase, lastSpeedRed))
                ) {
                    if (
                        note._lineIndex === redIndexOccupy &&
                        note._lineLayer === redLayerOccupy &&
                        !swingNoteDouble(note, notes, i)
                    ) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
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
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    const lastNoteDirection = {
        0: null,
        1: null,
        3: null,
    };
    const startNoteDot = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = flipCutDir[lastNoteDirection[note._type]];
                }
                if (
                    checkShrAngle(note._cutDirection, lastNoteDirection[note._type], note._type) &&
                    isBelowThres(note._time - lastNote[note._type]._time, tool.maxShrAngle + 0.01)
                ) {
                    arr.push(adjustTime(note._time, bpm, offset, bpmc));
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note._type] = note;
                } else {
                    lastNoteDirection[note._type] = note._cutDirection;
                }
            } else {
                if (
                    startNoteDot[note._type] &&
                    checkShrAngle(note._cutDirection, lastNoteDirection[note._type], note._type) &&
                    isBelowThres(note._time - lastNote[note._type]._time, tool.maxShrAngle + 0.01)
                ) {
                    arr.push(adjustTime(startNoteDot[note._type]._time, bpm, offset, bpmc));
                    startNoteDot[note._type] = null;
                }
                if (note._cutDirection !== 8) {
                    lastNoteDirection[note._type] = note._cutDirection;
                }
            }
        } else {
            lastNoteDirection[note._type] = note._cutDirection;
        }
        lastNote[note._type] = note;
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
function checkShrAngle(n1cd, n2cd, ntype) {
    if (n1cd === 8 || n2cd === 8) {
        return false;
    }
    if ((ntype === 0 ? n2cd === 7 : n2cd === 6) && n1cd === 0) {
        return true;
    }
    return false;
}

function detectStackedNote(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    // to avoid multiple of stack popping up, ignore anything within this time
    let lastTime;
    for (let i = 0, len = notes.length; i < len; i++) {
        if (toRealTime(notes[i]._time) < lastTime + tool.stack.note || notes[i]._type === 3) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (toRealTime(notes[j]._time) > toRealTime(notes[i]._time) + tool.stack.note) {
                break;
            }
            if (notes[i]._lineLayer === notes[j]._lineLayer && notes[i]._lineIndex === notes[j]._lineIndex) {
                arr.push(adjustTime(notes[i]._time, bpm, offset, bpmc));
                lastTime = toRealTime(notes[i]._time);
            }
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
function detectStackedBomb(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    let lastTime;
    for (let i = 0, len = notes.length; i < len; i++) {
        if (toRealTime(notes[i]._time) < lastTime + tool.stack.bomb || notes[i]._type !== 3) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (toRealTime(notes[j]._time) > toRealTime(notes[i]._time) + tool.stack.bomb) {
                break;
            }
            if (notes[i]._lineLayer === notes[j]._lineLayer && notes[i]._lineIndex === notes[j]._lineIndex) {
                arr.push(adjustTime(notes[i]._time, bpm, offset, bpmc));
                lastTime = toRealTime(notes[i]._time);
            }
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}

// im having pain pls help
// idk how this work but it does
function detectSpeedPause(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    const lastNotePause = {
        0: null,
        1: null,
        3: null,
    };
    const maybePause = {
        0: false,
        1: false,
        3: false,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                if (isBelowThres(note._time - lastNote[note._type]._time, tool.maxSpeedPause * 2 + 0.01)) {
                    if (
                        maybePause[0] &&
                        maybePause[1] &&
                        isBelowThres(
                            lastNote[note._type]._time - lastNotePause[note._type]._time,
                            tool.maxSpeedPause * 3 + 0.01
                        )
                    ) {
                        arr.push(adjustTime(lastNote[note._type]._time, bpm, offset, bpmc));
                    }
                    maybePause[note._type] = false;
                } else if (!maybePause[note._type]) {
                    maybePause[note._type] = true;
                    lastNotePause[note._type] = lastNote[note._type];
                }
                lastNote[note._type] = note;
            }
        } else {
            lastNote[note._type] = note;
        }
    }
    return arr;
}

function detectInvalidNote(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (notes[i]._lineLayer < 0 || notes[i]._lineLayer > 2 || notes[i]._lineIndex < 0 || notes[j]._lineIndex > 3) {
                arr.push(adjustTime(notes[i]._time, bpm, offset, bpmc));
            }
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}

function detectImproperWindowSnap(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                lastNote[note._type] = note;
            } else if (
                isSlantedWindow(note, lastNote[note._type]) &&
                isAboveThres(note._time - lastNote[note._type]._time, tool.windowSnapTolerance) &&
                note._cutDirection === lastNote[note._type]._cutDirection &&
                note._cutDirection !== 8 &&
                lastNote[note._type]._cutDirection !== 8
            ) {
                arr.push(adjustTime(lastNote[note._type]._time, bpm, offset, bpmc));
            }
        } else {
            lastNote[note._type] = note;
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
function isSlantedWindow(n1, n2) {
    return swingWindow(n1, n2) && !swingDiagonal(n1, n2) && !swingHorizontal(n1, n2) && !swingVertical(n1, n2);
}

function detectSlowSlider(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    const lastNoteTime = {
        0: null,
        1: null,
        3: null,
    };
    const sliderSpeed = {
        0: 0,
        1: 0,
        3: 0,
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if ((note._type === 0 || note._type === 1) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type])) {
                sliderSpeed[note._type] = 0;
                lastNoteTime[note._type] = note._time;
            } else {
                sliderSpeed[note._type] = Math.max(
                    sliderSpeed[note._type],
                    toRealTime(note._time - lastNote[note._type]._time) / (swingWindow(note, lastNote[note._type]) ? 2 : 1)
                );
            }
            lastNote[note._type] = note;
            if (sliderSpeed[note._type] > tool.minSliderSpeed) {
                arr.push(adjustTime(lastNoteTime[note._type], bpm, offset, bpmc));
            }
        } else {
            lastNoteTime[note._type] = note._time;
            lastNote[note._type] = note;
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
