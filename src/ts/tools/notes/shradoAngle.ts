import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

const defaultMaxTime = 0.15;
const defaultDistance = 1;
let localBPM!: beatmap.BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlInputDistance = document.createElement('input');
const htmlLabelDistance = document.createElement('label');
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

htmlLabelDistance.textContent = 'min distance: ';
htmlLabelDistance.htmlFor = 'input__tools-shrado-angle-distance';
htmlInputDistance.id = 'input__tools-shrado-angle-distance';
htmlInputDistance.className = 'input-toggle input--small';
htmlInputDistance.type = 'number';
htmlInputDistance.min = '0';
htmlInputDistance.value = defaultDistance.toString();
htmlInputDistance.addEventListener('change', inputDistanceHandler);

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
htmlContainer.appendChild(htmlLabelDistance);
htmlContainer.appendChild(htmlInputDistance);
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
            distance: defaultDistance,
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

function inputDistanceHandler(this: HTMLInputElement) {
    tool.input.params.distance = Math.max(parseInt(this.value), 0);
    this.value = tool.input.params.distance.toString();
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
    const { maxTime: temp, distance } = <{ maxTime: number; distance: number }>(
        tool.input.params
    );
    const maxTime = bpm.toBeatTime(temp) + 0.001;

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.v3.ColorNote | null } = {};
    const swingNoteArray: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
        3: [],
    };
    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note.isNote(note) && lastNote[note._type]) {
            if (
                swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])
            ) {
                // FIXME: maybe fix rotation or something
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] =
                        note.flipDirection[lastNoteDirection[note._type]] ?? 8;
                }
                if (
                    note.distance(note, lastNote[note._type]) >= distance &&
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
                    note.distance(note, lastNote[note._type]) >= distance &&
                    checkShrAngle(
                        note._cutDirection,
                        lastNoteDirection[note._type],
                        note._type
                    ) &&
                    note._time - lastNote[note._type]._time <= maxTime
                ) {
                    arr.push(startNoteDot[note._type] as beatmap.v3.ColorNote);
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

function run(map: ToolArgs) {
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>shrado angle [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
