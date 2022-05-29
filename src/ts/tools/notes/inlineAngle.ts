import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';
import { checkDirection } from '../../analyzers/placement/note';
import swing from '../../analyzers/swing/swing';
import { ColorNote } from '../../beatmap/v3';
import { printResultTime } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';

const name = 'Inline Sharp Angle';
const description = 'Check for angle changes within inline note.';
const enabled = true;
const defaultMaxTime = 0.15;
let localBPM!: beatmap.BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputMaxTime = document.createElement('input');
const htmlLabelMaxTime = document.createElement('label');
const htmlInputMaxBeat = document.createElement('input');
const htmlLabelMaxBeat = document.createElement('label');

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

htmlContainer.appendChild(
    UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
        tool.input.enabled = this.checked;
    }),
);
htmlContainer.appendChild(htmlLabelMaxTime);
htmlContainer.appendChild(htmlInputMaxTime);
htmlContainer.appendChild(htmlLabelMaxBeat);
htmlContainer.appendChild(htmlInputMaxBeat);

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_INLINE_ANGLE,
        output: ToolOutputOrder.NOTES_INLINE_ANGLE,
    },
    input: {
        enabled,
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
    htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.maxTime as number), 2).toString();
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.maxTime * 1000, 1).toString();
    if (localBPM) {
        htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.maxTime as number), 2).toString();
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
    const noteContainer = map.difficulty!.noteContainer;
    const { maxTime: temp } = <{ maxTime: number }>tool.input.params;
    const maxTime = bpm.toBeatTime(temp) + 0.001;

    const lastNote: { [key: number]: NoteContainer } = {};
    const lastNoteAngle: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: ColorNote | null } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
        3: [],
    };
    const arr: ColorNote[] = [];
    let lastTime = 0;
    let lastIndex = 0;
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        const note = noteContainer[i];
        if (note.type === 'note' && lastNote[note.data.color]) {
            if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
                if (startNoteDot[note.data.color]) {
                    startNoteDot[note.data.color] = null;
                    lastNoteAngle[note.data.color] = (lastNoteAngle[note.data.color] + 180) % 360;
                }
                if (
                    checkInline(note.data, noteContainer, lastIndex, maxTime) &&
                    checkDirection(note.data, lastNoteAngle[note.data.color], 90, true)
                ) {
                    arr.push(note.data);
                }
                if (note.data.direction === 8) {
                    startNoteDot[note.data.color] = note.data;
                } else {
                    lastNoteAngle[note.data.color] = note.data.getAngle();
                }
                swingNoteArray[note.data.color] = [];
            } else {
                if (
                    startNoteDot[note.data.color] &&
                    checkInline(note.data, noteContainer, lastIndex, maxTime) &&
                    checkDirection(note.data, lastNoteAngle[note.data.color], 90, true)
                ) {
                    arr.push(startNoteDot[note.data.color] as ColorNote);
                    startNoteDot[note.data.color] = null;
                }
                if (note.data.direction !== 8) {
                    lastNoteAngle[note.data.color] = note.data.getAngle();
                }
            }
        } else if (note.type === 'note') {
            lastNoteAngle[note.data.color] = note.data.getAngle();
        }
        if (note.type === 'note') {
            lastNote[note.data.color] = note;
            swingNoteArray[note.data.color].push(note);
        }
        if (note.type === 'bomb') {
            // on bottom row
            if (note.data.posY === 0) {
                //on right center
                if (note.data.posX === 1) {
                    lastNoteAngle[0] = beatmap.NoteCutAngle[0];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note.data.posX === 2) {
                    lastNoteAngle[1] = beatmap.NoteCutAngle[0];
                    startNoteDot[1] = null;
                }
                //on top row
            }
            if (note.data.posY === 2) {
                //on right center
                if (note.data.posX === 1) {
                    lastNoteAngle[0] = beatmap.NoteCutAngle[1];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note.data.posX === 2) {
                    lastNoteAngle[1] = beatmap.NoteCutAngle[1];
                    startNoteDot[1] = null;
                }
            }
        }
    }
    return arr
        .map((n) => n.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function checkInline(n: beatmap.v3.ColorNote, notes: NoteContainer[], index: number, maxTime: number) {
    for (let i = index; notes[i].data.time < n.time; i++) {
        const note = notes[i];
        if (note.type !== 'note') {
            continue;
        }
        if (n.isInline(note.data) && n.time - notes[i].data.time <= maxTime) {
            return true;
        }
    }
    return false;
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map);

    if (result.length) {
        tool.output.html = printResultTime('Inline sharp angle', result, map.settings.bpm);
    } else {
        tool.output.html = null;
    }
}

export default tool;
