import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

const defaultMaxTime = 0.15;
let localBPM!: beatmap.BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlInputMaxTime = document.createElement('input');
const htmlLabelMaxTime = document.createElement('label');
const htmlInputMaxBeat = document.createElement('input');
const htmlLabelMaxBeat = document.createElement('label');

htmlLabelCheck.textContent = ' Inline sharp angle';
htmlLabelCheck.htmlFor = 'input__tools-inline-angle-check';
htmlInputCheck.id = 'input__tools-inline-angle-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlLabelMaxTime.textContent = 'max time (ms): ';
htmlLabelMaxTime.htmlFor = 'input__tools-inline-angle-time';
htmlInputMaxTime.id = 'input__tools-inline-angle-time';
htmlInputMaxTime.className = 'input-toggle input--small';
htmlInputMaxTime.type = 'number';
htmlInputMaxTime.min = '0';
htmlInputMaxTime.value = round(defaultMaxTime * 1000, 1).toString();
htmlInputMaxTime.addEventListener('change', inputTimeHandler);

htmlLabelMaxBeat.textContent = ' (beat): ';
htmlLabelMaxBeat.htmlFor = 'input__tools-inline-angle-beat';
htmlInputMaxBeat.id = 'input__tools-inline-angle-beat';
htmlInputMaxBeat.className = 'input-toggle input--small';
htmlInputMaxBeat.type = 'number';
htmlInputMaxBeat.min = '0';
htmlInputMaxBeat.step = '0.1';
htmlInputMaxBeat.addEventListener('change', inputBeatHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);
htmlContainer.appendChild(document.createElement('br'));
htmlContainer.appendChild(htmlLabelMaxTime);
htmlContainer.appendChild(htmlInputMaxTime);
htmlContainer.appendChild(htmlLabelMaxBeat);
htmlContainer.appendChild(htmlInputMaxBeat);

const tool: Tool = {
    name: 'Inline Sharp Angle',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 30,
        output: 160,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {
            maxTime: defaultMaxTime,
        },
        html: htmlContainer,
        adjustTime: adjustTimeHandler,
    },
    output: {
        html: null,
    },
    run,
};

function adjustTimeHandler(bpm: beatmap.BeatPerMinute) {
    localBPM = bpm;
    htmlInputMaxBeat.value = round(
        localBPM.toBeatTime(tool.input.params.maxTime as number),
        2
    ).toString();
}

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.maxTime * 1000, 1).toString();
    if (localBPM) {
        htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime as number),
            2
        ).toString();
    }
}

function inputBeatHandler(this: HTMLInputElement) {
    if (!localBPM) {
        this.value = '0';
        return;
    }
    let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
    tool.input.params.maxTime = localBPM.toRealTime(val);
    htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
    this.value = val.toString();
}

function check(map: ToolArgs) {
    const { bpm } = mapSettings;
    const { colorNotes } = map.difficulty.data;
    const { maxTime: temp } = <{ maxTime: number }>tool.input.params;
    const maxTime = bpm.toBeatTime(temp) + 0.001;

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const lastNoteAngle: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.v3.ColorNote | null } = {};
    const swingNoteArray: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
        3: [],
    };
    const arr: beatmap.v3.ColorNote[] = [];
    let lastTime = 0;
    let lastIndex = 0;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note.isNote(note) && lastNote[note._type]) {
            if (
                swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])
            ) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteAngle[note._type] = (lastNoteAngle[note._type] + 180) % 360;
                }
                if (
                    checkInline(note, notes, lastIndex, maxTime) &&
                    note.checkDirection(note, lastNoteAngle[note._type], 90, true)
                ) {
                    arr.push(note);
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note._type] = note;
                } else {
                    lastNoteAngle[note._type] = note.getAngle(note);
                }
                swingNoteArray[note._type] = [];
            } else {
                if (
                    startNoteDot[note._type] &&
                    checkInline(note, notes, lastIndex, maxTime) &&
                    note.checkDirection(note, lastNoteAngle[note._type], 90, true)
                ) {
                    arr.push(startNoteDot[note._type] as beatmap.v3.ColorNote);
                    startNoteDot[note._type] = null;
                }
                if (note._cutDirection !== 8) {
                    lastNoteAngle[note._type] = note.getAngle(note);
                }
            }
        } else {
            lastNoteAngle[note._type] = note.getAngle(note);
        }
        if (lastTime < note._time - maxTime) {
            lastTime = note._time - maxTime;
            lastIndex = i;
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
        if (note._type === 3) {
            // on bottom row
            if (note._lineLayer === 0) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteAngle[0] = note.cutAngle[0];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteAngle[1] = note.cutAngle[0];
                    startNoteDot[1] = null;
                }
                //on top row
            }
            if (note._lineLayer === 2) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteAngle[0] = note.cutAngle[1];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteAngle[1] = note.cutAngle[1];
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
    n: beatmap.v3.ColorNote,
    notes: beatmap.v3.ColorNote[],
    index: number,
    maxTime: number
) {
    for (let i = index; notes[i]._time < n._time; i++) {
        if (note.isInline(n, notes[i]) && n._time - notes[i]._time <= maxTime) {
            return true;
        }
    }
    return false;
}

function run(map: ToolArgs) {
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Inline sharp angle [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
