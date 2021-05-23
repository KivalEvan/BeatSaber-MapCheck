'use strict';
/* NOTE SCRIPT - note.js
    note pattern detection and stuff idk
    TODO: basic parity check
    TODO: basic unrankable hit */

function isNote(note) {
    return note._type === 0 || note._type === 1;
}

function getNoteCount(notes) {
    const noteCount = { red: 0, blue: 0, bomb: 0, chromaN: 0, chromaB: 0 };
    for (let i = notes.length - 1; i >= 0; i--) {
        if (notes[i]._type === 0) {
            noteCount.red++;
            if (notes[i]._customData?._color) {
                noteCount.chromaN++;
            }
        } else if (notes[i]._type === 1) {
            noteCount.blue++;
            if (notes[i]._customData?._color) {
                noteCount.chromaN++;
            }
        } else if (notes[i]._type === 3) {
            noteCount.bomb++;
            if (notes[i]._customData?._color) {
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                EBPM = Math.max(EBPM, bpm / ((note._time - lastNote[note._type]._time) * 2));
                swingNoteArray[note._type] = [];
            }
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
    }
    return EBPM;
}
function findEffectiveBPMSwing(notes, bpm) {
    let EBPM = 0;
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                EBPM = Math.max(EBPM, bpm / ((note._time - lastNote[note._type]._time) * 2));
                lastNote[note._type] = note;
                swingNoteArray[note._type] = [];
            }
        } else {
            lastNote[note._type] = note;
        }
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                EBPM = bpm / ((note._time - lastNote[note._type]._time) * 2);
                swingNoteArray[note._type] = [];
            }
        }
        if (EBPM > tool.ebpm.th) {
            arr.push(adjustTime(note._time, bpm, offset, bpmc));
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        let EBPM = 0;
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                EBPM = bpm / ((note._time - lastNote[note._type]._time) * 2);
                lastNote[note._type] = note;
                swingNoteArray[note._type] = [];
            }
        } else {
            lastNote[note._type] = note;
        }
        if (EBPM > tool.ebpm.thSwing) {
            arr.push(adjustTime(note._time, bpm, offset, bpmc));
        }
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                swingNoteArray[note._type] = [];
            } else {
                sliderSpeed[note._type] = Math.max(
                    sliderSpeed[note._type],
                    toRealTime(note._time - lastNote[note._type]._time) / (swingWindow(note, lastNote[note._type]) ? 2 : 1)
                );
            }
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (
                !swingNext(note, lastNote[note._type], swingNoteArray[note._type]) &&
                toRealTime(note._time - lastNote[note._type]._time) > 0.001
            ) {
                sliderSpeed[note._type] = Math.min(
                    sliderSpeed[note._type],
                    toRealTime(note._time - lastNote[note._type]._time) / (swingWindow(note, lastNote[note._type]) ? 2 : 1)
                );
            } else {
                swingNoteArray[note._type] = [];
            }
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = flipCutDir[lastNoteDirection[note._type]];
                }
                if (checkAngle(note._cutDirection, lastNoteDirection[note._type], 45)) {
                    arr.push(adjustTime(note._time, bpm, offset, bpmc));
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note._type] = note;
                } else {
                    lastNoteDirection[note._type] = note._cutDirection;
                }
                swingNoteArray[note._type] = [];
            } else {
                if (startNoteDot[note._type] && checkAngle(note._cutDirection, lastNoteDirection[note._type], 45)) {
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
        swingNoteArray[note._type].push(note);
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
            }
            if (note._lineLayer === 2) {
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const noteTime = adjustTime(note._time, bpm, offset, bpmc);
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                if (checkPrec(noteTime)) {
                    arr.push(noteTime);
                }
                lastNote[note._type] = note;
                swingNoteArray[note._type] = [];
            }
        } else {
            if (isNote(note) && checkPrec(noteTime)) {
                arr.push(noteTime);
            }
            lastNote[note._type] = note;
        }
        swingNoteArray[note._type].push(note);
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
function detectHitboxStaircase(diff, mapSettings) {
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
    const lastSpeed = {
        0: null,
        1: null,
        3: null,
    };
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    const noteOccupy = {
        0: { _lineIndex: 0, _lineLayer: 0 },
        1: { _lineIndex: 0, _lineLayer: 0 },
        3: { _lineIndex: 0, _lineLayer: 0 },
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                lastSpeed[note._type] = toRealTime(note._time - lastNote[note._type]._time);
                if (note._cutDirection !== 8) {
                    noteOccupy[note._type]._lineIndex = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    noteOccupy[note._type]._lineLayer = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                } else {
                    noteOccupy[note._type]._lineIndex = -1;
                    noteOccupy[note._type]._lineLayer = -1;
                }
                swingNoteArray[note._type] = [];
                lastNoteDirection[note._type] = note._cutDirection;
            } else if (swingNoteEnd(note, lastNote[note._type], lastNoteDirection[note._type])) {
                if (note._cutDirection !== 8) {
                    noteOccupy[note._type]._lineIndex = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                    noteOccupy[note._type]._lineLayer = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
                    lastNoteDirection[note._type] = note._cutDirection;
                } else {
                    noteOccupy[note._type]._lineIndex =
                        note._lineIndex + swingCutDirectionSpace[lastNoteDirection[note._type]][0];
                    noteOccupy[note._type]._lineLayer =
                        note._lineLayer + swingCutDirectionSpace[lastNoteDirection[note._type]][1];
                }
            }
            if (
                lastNote[(note._type + 1) % 2] &&
                note._time - lastNote[(note._type + 1) % 2]._time !== 0 &&
                isBelowThres(
                    note._time - lastNote[(note._type + 1) % 2]._time,
                    Math.min(tool.hitbox.staircase, lastSpeed[(note._type + 1) % 2])
                )
            ) {
                if (
                    note._lineIndex === noteOccupy[(note._type + 1) % 2]._lineIndex &&
                    note._lineLayer === noteOccupy[(note._type + 1) % 2]._lineLayer &&
                    !swingNoteDouble(note, notes, i)
                ) {
                    arr.push(adjustTime(note._time, bpm, offset, bpmc));
                }
            }
        } else {
            if (note._cutDirection !== 8) {
                noteOccupy[note._type]._lineIndex = note._lineIndex + swingCutDirectionSpace[note._cutDirection][0];
                noteOccupy[note._type]._lineLayer = note._lineLayer + swingCutDirectionSpace[note._cutDirection][1];
            } else {
                noteOccupy[note._type]._lineIndex = -1;
                noteOccupy[note._type]._lineLayer = -1;
            }
            lastNoteDirection[note._type] = note._cutDirection;
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
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
                swingNoteArray[note._type] = [];
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
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
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
                swingNoteArray[note._type] = [];
                lastNote[note._type] = note;
            }
        } else {
            lastNote[note._type] = note;
        }
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                lastNote[note._type] = note;
                swingNoteArray[note._type] = [];
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
        swingNoteArray[note._type].push(note);
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                sliderSpeed[note._type] = 0;
                lastNoteTime[note._type] = note._time;
                swingNoteArray[note._type] = [];
            } else {
                sliderSpeed[note._type] = Math.max(
                    sliderSpeed[note._type],
                    toRealTime(note._time - lastNote[note._type]._time) / (swingWindow(note, lastNote[note._type]) ? 2 : 1)
                );
            }
            if (sliderSpeed[note._type] > tool.minSliderSpeed) {
                arr.push(adjustTime(lastNoteTime[note._type], bpm, offset, bpmc));
            }
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
    }
    return arr.filter(function (x, i, ary) {
        return !i || x !== ary[i - 1];
    });
}

// may not work well with stack but fuck it
function detectInlineAngle(diff, mapSettings) {
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
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    let lastTime = 0;
    let lastIndex = 0;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = flipCutDir[lastNoteDirection[note._type]];
                }
                if (checkInline(note, notes, lastIndex) && checkAngle(note._cutDirection, lastNoteDirection[note._type], 90)) {
                    arr.push(adjustTime(note._time, bpm, offset, bpmc));
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note._type] = note;
                } else {
                    lastNoteDirection[note._type] = note._cutDirection;
                }
                swingNoteArray[note._type] = [];
            } else {
                if (
                    startNoteDot[note._type] &&
                    checkInline(note, notes, lastIndex) &&
                    checkAngle(note._cutDirection, lastNoteDirection[note._type], 90)
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
        if (lastTime < note._time - toBeatTime(tool.maxInlineAngle - 0.01)) {
            lastTime = note._time - toBeatTime(tool.maxInlineAngle - 0.01);
            lastIndex = i;
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
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
            }
            if (note._lineLayer === 2) {
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
function checkInline(note, notes, index) {
    for (let i = index; notes[i]._time < note._time; i++) {
        if (
            note._lineIndex === notes[i]._lineIndex &&
            note._lineLayer === notes[i]._lineLayer &&
            isBelowThres(note._time - notes[i]._time, tool.maxInlineAngle + 0.01)
        ) {
            return true;
        }
    }
    return false;
}
function checkAngle(n1cd, n2cd, angle, invert = false) {
    if (n1cd === 8 || n2cd === 8) {
        return false;
    }
    return invert
        ? shortRotDistance(noteCutAngle[n1cd], noteCutAngle[n2cd], 360) >= angle
        : shortRotDistance(noteCutAngle[n1cd], noteCutAngle[n2cd], 360) <= angle;
}

function detectReverseStaircase(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { njs, bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                swingNoteArray[note._type] = [];
            }
        }
        for (const other of swingNoteArray[(note._type + 1) % 2]) {
            if (other._cutDirection !== 8) {
                let noteOccupyLineIndex = other._lineIndex + swingCutDirectionSpace[flipCutDir[other._cutDirection]][0];
                let noteOccupyLineLayer = other._lineLayer + swingCutDirectionSpace[flipCutDir[other._cutDirection]][1];
                if (
                    !(njs > bpm / (120 * (note._time - other._time))) &&
                    note._lineIndex === noteOccupyLineIndex &&
                    note._lineLayer === noteOccupyLineLayer
                ) {
                    arr.push(adjustTime(other._time, bpm, offset, bpmc));
                    break;
                }
            }
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
    }
    return arr;
}

function detectInlineHitbox(diff, mapSettings) {
    const { _notes: notes } = diff;
    const { njs, bpm, bpmc, offset } = mapSettings;
    const arr = [];
    const lastNote = {
        0: null,
        1: null,
        3: null,
    };
    const swingNoteArray = {
        0: [],
        1: [],
        3: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (isNote(note) && lastNote[note._type]) {
            if (swingNext(note, lastNote[note._type], swingNoteArray[note._type])) {
                swingNoteArray[note._type] = [];
            }
        }
        for (const other of swingNoteArray[(note._type + 1) % 2]) {
            // magic number 1.425 from saber length + good/bad hitbox
            if (
                !(njs > (1.425 * bpm) / (120 * (note._time - other._time))) &&
                note._lineIndex === other._lineIndex &&
                note._lineLayer === other._lineLayer
            ) {
                arr.push(adjustTime(note._time, bpm, offset, bpmc));
                break;
            }
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
    }
    return arr;
}
