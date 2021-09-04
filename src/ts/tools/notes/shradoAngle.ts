import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

const defaultMaxTime = 0.15;
let localBPM!: beatmap.bpm.BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlInputMaxTime = document.createElement('input');
const htmlLabelMaxTime = document.createElement('label');
const htmlInputMaxBeat = document.createElement('input');
const htmlLabelMaxBeat = document.createElement('label');

htmlLabelCheck.textContent = ' shrado angle';
htmlLabelCheck.htmlFor = 'input__tools-shrado-angle-check';
htmlInputCheck.id = 'input__tools-shrado-angle-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = false;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlLabelMaxTime.textContent = 'max time (ms): ';
htmlLabelMaxTime.htmlFor = 'input__tools-shrado-angle-time';
htmlInputMaxTime.id = 'input__tools-shrado-angle-time';
htmlInputMaxTime.className = 'input-toggle input--small';
htmlInputMaxTime.type = 'number';
htmlInputMaxTime.min = '0';
htmlInputMaxTime.value = round(defaultMaxTime * 1000, 1).toString();
htmlInputMaxTime.addEventListener('change', inputTimeHandler);

htmlLabelMaxBeat.textContent = ' (beat): ';
htmlLabelMaxBeat.htmlFor = 'input__tools-shrado-angle-beat';
htmlInputMaxBeat.id = 'input__tools-shrado-angle-beat';
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
    name: 'shrado Angle',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 40,
        output: 170,
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
    run: run,
};

function adjustTimeHandler(bpm: beatmap.bpm.BeatPerMinute) {
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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;
    const { maxTime: temp } = <{ maxTime: number }>tool.input.params;
    const maxTime = bpm.toBeatTime(temp) + 0.001;

    const lastNote: { [key: number]: beatmap.note.Note } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.note.Note | null } = {};
    const swingNoteArray: { [key: number]: beatmap.note.Note[] } = {
        0: [],
        1: [],
        3: [],
    };
    const arr: beatmap.note.Note[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (beatmap.note.isNote(note) && lastNote[note._type]) {
            if (
                swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])
            ) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] =
                        beatmap.note.flipDirection[lastNoteDirection[note._type]];
                }
                if (
                    checkShrAngle(
                        note._cutDirection,
                        lastNoteDirection[note._type],
                        note._type
                    ) &&
                    note._time - lastNote[note._type]._time <= maxTime
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
                    checkShrAngle(
                        note._cutDirection,
                        lastNoteDirection[note._type],
                        note._type
                    ) &&
                    note._time - lastNote[note._type]._time <= maxTime
                ) {
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
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
    }
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function checkShrAngle(
    currCutDirection: number,
    prevCutDirection: number,
    type: number
) {
    if (currCutDirection === 8 || prevCutDirection === 8) {
        return false;
    }
    if (
        (type === 0 ? prevCutDirection === 7 : prevCutDirection === 6) &&
        currCutDirection === 0
    ) {
        return true;
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
        htmlResult.innerHTML = `<b>shrado angle [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
