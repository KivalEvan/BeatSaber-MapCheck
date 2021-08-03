import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

const defaultSpeed = 0.15;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlInputMinTime = document.createElement('input');
const htmlLabelMinTime = document.createElement('label');
const htmlInputMinPrec = document.createElement('input');
const htmlLabelMinPrec = document.createElement('label');

let localBPM!: beatmap.bpm.BeatPerMinute;

htmlLabelCheck.textContent = ' Inline sharp angle';
htmlLabelCheck.htmlFor = 'input__tools-inline-angle-check';
htmlInputCheck.id = 'input__tools-inline-angle-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlLabelMinTime.textContent = 'min speed (ms): ';
htmlLabelMinTime.htmlFor = 'input__tools-inline-angle-time';
htmlInputMinTime.id = 'input__tools-inline-angle-time';
htmlInputMinTime.className = 'input-toggle input--small';
htmlInputMinTime.type = 'number';
htmlInputMinTime.min = '0';
htmlInputMinTime.value = round(defaultSpeed * 1000, 1).toString();
htmlInputMinTime.addEventListener('change', inputTimeHandler);

htmlLabelMinPrec.textContent = ' (prec): ';
htmlLabelMinPrec.htmlFor = 'input__tools-inline-angle-prec';
htmlInputMinPrec.id = 'input__tools-inline-angle-prec';
htmlInputMinPrec.className = 'input-toggle input--small';
htmlInputMinPrec.type = 'number';
htmlInputMinPrec.min = '0';
htmlInputMinPrec.addEventListener('change', inputPrecHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);
htmlContainer.appendChild(document.createElement('br'));
htmlContainer.appendChild(htmlLabelMinTime);
htmlContainer.appendChild(htmlInputMinTime);
htmlContainer.appendChild(htmlLabelMinPrec);
htmlContainer.appendChild(htmlInputMinPrec);

const tool: Tool = {
    name: 'Slow Slider',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {
            minSpeed: defaultSpeed,
        },
        html: htmlContainer,
        adjustTime: adjustTimeHandler,
    },
    output: {
        html: null,
    },
    run: run,
};

function adjustTimeHandler(bpm: beatmap.bpm.BeatPerMinute) {
    localBPM = bpm;
    htmlInputMinPrec.value = round(
        1 / localBPM.toBeatTime(tool.input.params.minSpeed as number),
        2
    ).toString();
}

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.minSpeed = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.minSpeed * 1000, 1).toString();
    if (localBPM) {
        htmlInputMinPrec.value = round(
            1 / localBPM.toBeatTime(tool.input.params.minSpeed as number),
            2
        ).toString();
    }
}

function inputPrecHandler(this: HTMLInputElement) {
    if (!localBPM) {
        this.value = '0';
        return;
    }
    let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
    tool.input.params.minSpeed = localBPM.toRealTime(1 / val);
    htmlInputMinTime.value = round(tool.input.params.minSpeed * 1000, 1).toString();
    this.value = val.toString();
}

function check(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;
    const { minSpeed: temp } = <{ minSpeed: number }>tool.input.params;
    const minSpeed = bpm.toBeatTime(temp);

    const lastNote: { [key: number]: beatmap.note.Note } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.note.Note | null } = {};
    const swingNoteArray: { [key: number]: beatmap.note.Note[] } = {
        0: [],
        1: [],
        3: [],
    };
    const arr: beatmap.note.Note[] = [];
    let lastTime = 0;
    let lastIndex = 0;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (beatmap.note.isNote(note) && lastNote[note._type]) {
            if (swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] =
                        beatmap.note.flipDirection[lastNoteDirection[note._type]];
                }
                if (
                    checkInline(note, notes, lastIndex, minSpeed) &&
                    beatmap.note.checkDirection(
                        note._cutDirection,
                        lastNoteDirection[note._type],
                        90,
                        true
                    )
                ) {
                    arr.push(note);
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
                    checkInline(note, notes, lastIndex, minSpeed) &&
                    beatmap.note.checkDirection(
                        note._cutDirection,
                        lastNoteDirection[note._type],
                        90,
                        true
                    )
                ) {
                    // what how is this??
                    arr.push(startNoteDot[note._type] as beatmap.note.Note);
                    startNoteDot[note._type] = null;
                }
                if (note._cutDirection !== 8) {
                    lastNoteDirection[note._type] = note._cutDirection;
                }
            }
        } else {
            lastNoteDirection[note._type] = note._cutDirection;
        }
        if (lastTime < note._time - minSpeed) {
            lastTime = note._time - minSpeed;
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
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function checkInline(
    n: beatmap.note.Note,
    notes: beatmap.note.Note[],
    index: number,
    minSpeed: number
) {
    for (let i = index; notes[i]._time < n._time; i++) {
        if (beatmap.note.isInline(n, notes[i]) && n._time - notes[i]._time < minSpeed) {
            return true;
        }
    }
    return false;
}

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Inline sharp angle [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
