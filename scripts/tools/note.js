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
function countNoteLayer(notes, l) {
    let count = 0;
    notes.forEach((note) => {
        if (note._type !== 3 && note._lineLayer === l) count++;
    });
    return count;
}
function countNoteIndex(notes, i) {
    let count = 0;
    notes.forEach((note) => {
        if (note._type !== 3 && note._lineIndex === i) count++;
    });
    return count;
}
function countNoteIndexLayer(notes, i, l) {
    let count = 0;
    notes.forEach((note) => {
        if (note._type !== 3 && note._lineIndex === i && note._lineLayer === l) count++;
    });
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
                    EBPM = Math.max(EBPM, bpm / ((note._time - lastRed._time) * 2));
                }
            }
            lastRed = note;
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    EBPM = Math.max(EBPM, bpm / ((note._time - lastBlue._time) * 2));
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
            } else {
                lastRed = note;
            }
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    EBPM = Math.max(EBPM, bpm / ((note._time - lastBlue._time) * 2));
                    lastBlue = note;
                }
            } else {
                lastBlue = note;
            }
        }
    }
    return EBPM;
}
function getEffectiveBPMTime(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
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
        } else if (note._type === 1) {
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
    const arr = [];
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
            } else {
                lastRed = note;
            }
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    EBPM = bpm / ((note._time - lastBlue._time) * 2);
                    lastBlue = note;
                }
            } else {
                lastBlue = note;
            }
        }
        if (EBPM > tool.ebpm.thSwing) arr.push(adjustTime(note._time, bpm, offset, bpmc));
    }
    return arr;
}
function getMinSliderSpeed(notes) {
    let speedR = 0;
    let speedB = 0;
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (!swingNext(note, lastRed)) {
                    speedR = Math.max(speedR, toRealTime(note._time - lastRed._time) / (swingWindow(note, lastRed) ? 2 : 1));
                }
                lastRed = note;
            } else {
                lastRed = note;
            }
        } else if (note._type === 1) {
            if (lastBlue) {
                if (!swingNext(note, lastBlue)) {
                    speedB = Math.max(speedB, toRealTime(note._time - lastBlue._time) / (swingWindow(note, lastBlue) ? 2 : 1));
                }
                lastBlue = note;
            } else {
                lastBlue = note;
            }
        }
    }
    return Math.max(speedR, speedB);
}
function getMaxSliderSpeed(notes) {
    let speedR = Number.MAX_SAFE_INTEGER;
    let speedB = Number.MAX_SAFE_INTEGER;
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (!swingNext(note, lastRed) && toRealTime(note._time - lastRed._time) > 0.001) {
                    speedR = Math.min(speedR, toRealTime(note._time - lastRed._time) / (swingWindow(note, lastRed) ? 2 : 1));
                }
                lastRed = note;
            } else {
                lastRed = note;
            }
        } else if (note._type === 1) {
            if (lastBlue) {
                if (!swingNext(note, lastBlue) && toRealTime(note._time - lastBlue._time) > 0.001) {
                    speedB = Math.min(speedB, toRealTime(note._time - lastBlue._time) / (swingWindow(note, lastBlue) ? 2 : 1));
                }
                lastBlue = note;
            } else {
                lastBlue = note;
            }
        }
    }
    return Math.min(speedR, speedB);
}

function detectDoubleDirectional(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    const arr = [];
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
                    if (note._cutDirection === 8) {
                        startRedDot = note;
                    } else {
                        lastRedDir = note._cutDirection;
                    }
                } else {
                    if (startRedDot && checkDD(note._cutDirection, lastRedDir)) {
                        arr.push(adjustTime(startRedDot._time, bpm, offset, bpmc));
                        startRedDot = null;
                        lastRedDir = note._cutDirection;
                    }
                    if (note._cutDirection !== 8) {
                        startRedDot = null;
                        lastRedDir = note._cutDirection;
                    }
                }
            } else lastRedDir = note._cutDirection;
            lastRed = note;
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (startBlueDot) {
                        startBlueDot = null;
                        lastBlueDir = flipCutDir[lastBlueDir];
                    }
                    if (checkDD(note._cutDirection, lastBlueDir)) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    if (note._cutDirection === 8) {
                        startBlueDot = note;
                    } else {
                        lastBlueDir = note._cutDirection;
                    }
                } else {
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
            } else lastBlueDir = note._cutDirection;
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
        } else if (note._lineLayer === 1 && note._lineIndex === 2) {
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
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const noteTime = adjustTime(note._time, bpm, offset, bpmc);
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    if (checkPrec(noteTime)) {
                        arr.push(noteTime);
                    }
                    lastRed = note;
                }
            } else {
                if (checkPrec(noteTime)) {
                    arr.push(noteTime);
                }
                lastRed = note;
            }
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (checkPrec(noteTime)) {
                        arr.push(noteTime);
                    }
                    lastBlue = note;
                }
            } else {
                if (checkPrec(noteTime)) {
                    arr.push(noteTime);
                }
                lastBlue = note;
            }
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
                    if (
                        checkShrAngle(note._cutDirection, lastRedDir) &&
                        isBelowThres(note._time - lastRed._time, tool.maxShrAngle + 0.01)
                    ) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    if (note._cutDirection === 8) {
                        startRedDot = note;
                    } else {
                        lastRedDir = note._cutDirection;
                    }
                } else {
                    if (
                        startRedDot &&
                        checkShrAngle(note._cutDirection, lastRedDir) &&
                        isBelowThres(note._time - lastRed._time, tool.maxShrAngle + 0.01)
                    ) {
                        arr.push(adjustTime(startRedDot._time, bpm, offset, bpmc));
                        startRedDot = null;
                    }
                    if (note._cutDirection !== 8) {
                        lastRedDir = note._cutDirection;
                    }
                }
            } else {
                lastRedDir = note._cutDirection;
            }
            lastRed = note;
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (startBlueDot) {
                        startBlueDot = null;
                        lastBlueDir = flipCutDir[lastBlueDir];
                    }
                    if (
                        checkShrAngle(note._cutDirection, lastBlueDir) &&
                        isBelowThres(note, lastBlue, tool.maxShrAngle + 0.01)
                    ) {
                        arr.push(adjustTime(note._time, bpm, offset, bpmc));
                    }
                    if (note._cutDirection === 8) {
                        startBlueDot = note;
                    } else {
                        lastBlueDir = note._cutDirection;
                    }
                } else {
                    if (
                        startBlueDot &&
                        checkShrAngle(note._cutDirection, lastBlueDir) &&
                        isBelowThres(note, lastBlue, tool.maxShrAngle + 0.01)
                    ) {
                        arr.push(adjustTime(startBlueDot._time, bpm, offset, bpmc));
                        startBlueDot = null;
                    }
                    if (note._cutDirection !== 8) {
                        lastBlueDir = note._cutDirection;
                    }
                }
            } else {
                lastBlueDir = note._cutDirection;
            }
            lastBlue = note;
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
function checkShrAngle(n1cd, n2cd) {
    if (n1cd === 8 || n2cd === 8) {
        return false;
    }
    if ((n2cd === 6 || n2cd === 7) && n1cd === 0) {
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
                    if (isBelowThres(note._time - lastRed._time, tool.maxSpeedPause * 2 + 0.01)) {
                        if (
                            maybePauseBlue &&
                            maybePauseRed &&
                            isBelowThres(lastRed._time - lastRedPause._time, tool.maxSpeedPause * 3 + 0.01)
                        ) {
                            arr.push(adjustTime(lastRed._time, bpm, offset, bpmc));
                        }
                        maybePauseRed = false;
                    } else if (!maybePauseRed) {
                        maybePauseRed = true;
                        lastRedPause = lastRed;
                    }
                    lastRed = note;
                }
            } else {
                lastRed = note;
            }
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    if (isBelowThres(note._time - lastBlue._time, tool.maxSpeedPause * 2 + 0.01)) {
                        if (
                            maybePauseBlue &&
                            maybePauseRed &&
                            isBelowThres(lastBlue._time - lastBluePause._time, tool.maxSpeedPause * 3 + 0.01)
                        ) {
                            arr.push(adjustTime(lastBlue._time, bpm, offset, bpmc));
                        }
                        maybePauseBlue = false;
                    } else if (!maybePauseBlue) {
                        maybePauseBlue = true;
                        lastBluePause = lastBlue;
                    }
                    lastBlue = note;
                }
            } else {
                lastBlue = note;
            }
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
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    lastRed = note;
                } else if (
                    isSlantedWindow(note, lastRed) &&
                    isAboveThres(note._time - lastRed._time, tool.windowSnapTolerance) &&
                    note._cutDirection === lastRed._cutDirection &&
                    note._cutDirection !== 8 &&
                    lastRed._cutDirection !== 8
                ) {
                    arr.push(adjustTime(lastRed._time, bpm, offset, bpmc));
                }
            } else {
                lastRed = note;
            }
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    lastBlue = note;
                } else if (
                    isSlantedWindow(note, lastBlue) &&
                    isAboveThres(note._time - lastBlue._time, tool.windowSnapTolerance) &&
                    note._cutDirection === lastBlue._cutDirection &&
                    note._cutDirection !== 8 &&
                    lastBlue._cutDirection !== 8
                ) {
                    arr.push(adjustTime(lastBlue._time, bpm, offset, bpmc));
                }
            } else {
                lastBlue = note;
            }
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
    let speedR = 0;
    let speedB = 0;
    let lastRedTime;
    let lastBlueTime;
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    speedR = 0;
                    lastRedTime = note._time;
                } else {
                    speedR = Math.max(speedR, toRealTime(note._time - lastRed._time) / (swingWindow(note, lastRed) ? 2 : 1));
                }
                lastRed = note;
                if (speedR > tool.minSliderSpeed) {
                    arr.push(adjustTime(lastRedTime, bpm, offset, bpmc));
                }
            } else {
                lastRed = note;
            }
        }
        if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    speedB = 0;
                    lastBlueTime = note._time;
                } else {
                    speedB = Math.max(speedB, toRealTime(note._time - lastBlue._time) / (swingWindow(note, lastBlue) ? 2 : 1));
                }
                lastBlue = note;
                if (speedB > tool.minSliderSpeed) {
                    arr.push(adjustTime(lastBlueTime, bpm, offset, bpmc));
                }
            } else {
                lastBlue = note;
            }
        }
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}
