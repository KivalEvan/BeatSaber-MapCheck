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
    const { bpm } = map.settings;
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
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        const note = colorNotes[i];
        if (note.isNote(note) && lastNote[note.color]) {
            if (
                swing.next(note, lastNote[note.color], bpm, swingNoteArray[note.color])
            ) {
                // FIXME: maybe fix rotation or something
                if (startNoteDot[note.color]) {
                    startNoteDot[note.color] = null;
                    lastNoteDirection[note.color] =
                        note.flipDirection[lastNoteDirection[note.color]] ?? 8;
                }
                if (
                    note.distance(note, lastNote[note.color]) >= distance &&
                    checkShrAngle(
                        note.direction,
                        lastNoteDirection[note.color],
                        note.color
                    ) &&
                    note.time - lastNote[note.color].time <= maxTime
                ) {
                    arr.push(note);
                }
                if (note.direction === 8) {
                    startNoteDot[note.color] = note;
                } else {
                    lastNoteDirection[note.color] = note.direction;
                }
                swingNoteArray[note.color] = [];
            } else {
                if (
                    startNoteDot[note.color] &&
                    note.distance(note, lastNote[note.color]) >= distance &&
                    checkShrAngle(
                        note.direction,
                        lastNoteDirection[note.color],
                        note.color
                    ) &&
                    note.time - lastNote[note.color].time <= maxTime
                ) {
                    arr.push(startNoteDot[note.color] as beatmap.v3.ColorNote);
                    startNoteDot[note.color] = null;
                }
                if (note.direction !== 8) {
                    lastNoteDirection[note.color] = note.direction;
                }
            }
        } else {
            lastNoteDirection[note.color] = note.direction;
        }
        lastNote[note.color] = note;
        swingNoteArray[note.color].push(note);
    }
    return arr
        .map((n) => n.time)
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
