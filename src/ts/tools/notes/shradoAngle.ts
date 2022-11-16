import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import swing from '../../analyzers/swing/swing';
import { printResultTime } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { NoteColor, NoteDirection, NoteDirectionFlip } from '../../beatmap/shared/constants';

const name = 'shrado Angle';
const description = 'Look for common negative curvature pattern.';
const enabled = false;
const defaultMaxTime = 0.15;
const defaultDistance = 1;
let localBPM!: BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputDistance = document.createElement('input');
const htmlLabelDistance = document.createElement('label');
const htmlInputMaxTime = document.createElement('input');
const htmlLabelMaxTime = document.createElement('label');
const htmlInputMaxBeat = document.createElement('input');
const htmlLabelMaxBeat = document.createElement('label');

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

htmlContainer.appendChild(
    UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
        tool.input.enabled = this.checked;
    }),
);
htmlContainer.appendChild(htmlLabelDistance);
htmlContainer.appendChild(htmlInputDistance);
htmlContainer.appendChild(document.createElement('br'));
htmlContainer.appendChild(htmlLabelMaxTime);
htmlContainer.appendChild(htmlInputMaxTime);
htmlContainer.appendChild(htmlLabelMaxBeat);
htmlContainer.appendChild(htmlInputMaxBeat);

const tool: Tool<{ distance: number; maxTime: number }> = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_SHRADO_ANGLE,
        output: ToolOutputOrder.NOTES_SHRADO_ANGLE,
    },
    input: {
        enabled,
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

function adjustTimeHandler(bpm: BeatPerMinute) {
    localBPM = bpm;
    htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.maxTime), 2).toString();
}

function inputDistanceHandler(this: HTMLInputElement) {
    tool.input.params.distance = Math.max(parseInt(this.value), 0);
    this.value = tool.input.params.distance.toString();
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.maxTime * 1000, 1).toString();
    if (localBPM) {
        htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.maxTime), 2).toString();
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
    const { noteContainer } = map.difficulty!;
    const { maxTime: temp, distance } = tool.input.params;
    const maxTime = bpm.toBeatTime(temp) + 0.001;

    const lastNote: { [key: number]: NoteContainer } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: NoteContainer | null } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        [NoteColor.RED]: [],
        [NoteColor.BLUE]: [],
    };
    const arr: NoteContainer[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        if (noteContainer[i].type !== 'note') {
            continue;
        }
        const note = noteContainer[i] as NoteContainerNote;
        if (lastNote[note.data.color]) {
            if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
                // FIXME: maybe fix rotation or something
                if (startNoteDot[note.data.color]) {
                    startNoteDot[note.data.color] = null;
                    lastNoteDirection[note.data.color] = NoteDirectionFlip[lastNoteDirection[note.data.color]] ?? 8;
                }
                if (
                    note.data.getDistance(lastNote[note.data.color].data) >= distance &&
                    checkShrAngle(note.data.direction, lastNoteDirection[note.data.color], note.data.color) &&
                    note.data.time - lastNote[note.data.color].data.time <= maxTime
                ) {
                    arr.push(note);
                }
                if (note.data.direction === NoteDirection.ANY) {
                    startNoteDot[note.data.color] = note;
                } else {
                    lastNoteDirection[note.data.color] = note.data.direction;
                }
                swingNoteArray[note.data.color] = [];
            } else {
                if (
                    startNoteDot[note.data.color] &&
                    note.data.getDistance(lastNote[note.data.color].data) >= distance &&
                    checkShrAngle(note.data.direction, lastNoteDirection[note.data.color], note.data.color) &&
                    note.data.time - lastNote[note.data.color].data.time <= maxTime
                ) {
                    arr.push(startNoteDot[note.data.color]!);
                    startNoteDot[note.data.color] = null;
                }
                if (note.data.direction !== NoteDirection.ANY) {
                    lastNoteDirection[note.data.color] = note.data.direction;
                }
            }
        } else {
            lastNoteDirection[note.data.color] = note.data.direction;
        }
        lastNote[note.data.color] = note;
        swingNoteArray[note.data.color].push(note);
    }
    return arr
        .map((n) => n.data.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function checkShrAngle(currCutDirection: number, prevCutDirection: number, type: number) {
    if (currCutDirection === 8 || prevCutDirection === 8) {
        return false;
    }
    if ((type === 0 ? prevCutDirection === 7 : prevCutDirection === 6) && currCutDirection === 0) {
        return true;
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
        tool.output.html = printResultTime('Shrado angle', result, map.settings.bpm, 'warning');
    } else {
        tool.output.html = null;
    }
}

export default tool;
