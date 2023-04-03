import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { NoteContainer } from '../../types/beatmap/wrapper/container';
import { printResultTime } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { PositionX, PositionY } from '../../beatmap/shared/constants';

const name = 'Vision Block';
const description = 'Check for vision block caused by center note.';
const enabled = true;
const defaultMinTime = 0.1;
const defaultMaxTime = 0.5;

let localBPM!: BeatPerMinute;

const vbDiff: { [key: string]: { min: number; max: number } } = {
    Easy: {
        min: 0.025,
        max: 1.2,
    },
    Normal: {
        min: 0.05,
        max: 1,
    },
    Hard: {
        min: 0.08,
        max: 0.75,
    },
    Expert: {
        min: 0.1,
        max: 0.625,
    },
    ExpertPlus: {
        min: 0.1,
        max: 0.5,
    },
};

const htmlContainer = document.createElement('div');
const htmlInputTimeCheck = document.createElement('input');
const htmlLabelTimeCheck = document.createElement('label');
const htmlInputDiffCheck = document.createElement('input');
const htmlLabelDiffCheck = document.createElement('label');
const htmlInputMinTime = document.createElement('input');
const htmlLabelMinTime = document.createElement('label');
const htmlInputMinBeat = document.createElement('input');
const htmlLabelMinBeat = document.createElement('label');
const htmlInputMaxTime = document.createElement('input');
const htmlLabelMaxTime = document.createElement('label');
const htmlInputMaxBeat = document.createElement('input');
const htmlLabelMaxBeat = document.createElement('label');

htmlLabelTimeCheck.textContent = ' VB time specific ';
htmlLabelTimeCheck.htmlFor = 'input__tools-vb-time-check';
htmlInputTimeCheck.id = 'input__tools-vb-time-check';
htmlInputTimeCheck.className = 'input-toggle';
htmlInputTimeCheck.type = 'radio';
htmlInputTimeCheck.name = 'input__tools-vb-spec';
htmlInputTimeCheck.value = 'time';
htmlInputTimeCheck.addEventListener('change', inputSpecCheckHandler);

htmlLabelDiffCheck.textContent = ' VB difficulty specific ';
htmlLabelDiffCheck.htmlFor = 'input__tools-vb-diff-check';
htmlInputDiffCheck.id = 'input__tools-vb-diff-check';
htmlInputDiffCheck.className = 'input-toggle';
htmlInputDiffCheck.type = 'radio';
htmlInputDiffCheck.checked = true;
htmlInputDiffCheck.name = 'input__tools-vb-spec';
htmlInputDiffCheck.value = 'difficulty';
htmlInputDiffCheck.addEventListener('change', inputSpecCheckHandler);

htmlLabelMinTime.textContent = 'min time (ms): ';
htmlLabelMinTime.htmlFor = 'input__tools-vb-min-time';
htmlInputMinTime.id = 'input__tools-vb-min-time';
htmlInputMinTime.className = 'input-toggle input--small';
htmlInputMinTime.type = 'number';
htmlInputMinTime.min = '0';
htmlInputMinTime.value = round(defaultMinTime * 1000, 1).toString();
htmlInputMinTime.addEventListener('change', inputMinTimeHandler);

htmlLabelMinBeat.textContent = ' (beat): ';
htmlLabelMinBeat.htmlFor = 'input__tools-vb-min-beat';
htmlInputMinBeat.id = 'input__tools-vb-min-beat';
htmlInputMinBeat.className = 'input-toggle input--small';
htmlInputMinBeat.type = 'number';
htmlInputMinBeat.min = '0';
htmlInputMinBeat.step = '0.1';
htmlInputMinBeat.addEventListener('change', inputMinBeatHandler);

htmlLabelMaxTime.textContent = 'max time (ms): ';
htmlLabelMaxTime.htmlFor = 'input__tools-vb-max-time';
htmlInputMaxTime.id = 'input__tools-vb-max-time';
htmlInputMaxTime.className = 'input-toggle input--small';
htmlInputMaxTime.type = 'number';
htmlInputMaxTime.min = '0';
htmlInputMaxTime.value = round(defaultMaxTime * 1000, 1).toString();
htmlInputMaxTime.addEventListener('change', inputMaxTimeHandler);

htmlLabelMaxBeat.textContent = ' (beat): ';
htmlLabelMaxBeat.htmlFor = 'input__tools-vb-max-beat';
htmlInputMaxBeat.id = 'input__tools-vb-max-beat';
htmlInputMaxBeat.className = 'input-toggle input--small';
htmlInputMaxBeat.type = 'number';
htmlInputMaxBeat.min = '0';
htmlInputMaxBeat.step = '0.1';
htmlInputMaxBeat.addEventListener('change', inputMaxBeatHandler);

htmlContainer.appendChild(
    UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
        tool.input.enabled = this.checked;
    }),
);
htmlContainer.appendChild(htmlInputTimeCheck);
htmlContainer.appendChild(htmlLabelTimeCheck);
htmlContainer.appendChild(htmlInputDiffCheck);
htmlContainer.appendChild(htmlLabelDiffCheck);
htmlContainer.appendChild(document.createElement('br'));
htmlContainer.appendChild(htmlLabelMinTime);
htmlContainer.appendChild(htmlInputMinTime);
htmlContainer.appendChild(htmlLabelMinBeat);
htmlContainer.appendChild(htmlInputMinBeat);
htmlContainer.appendChild(document.createElement('br'));
htmlContainer.appendChild(htmlLabelMaxTime);
htmlContainer.appendChild(htmlInputMaxTime);
htmlContainer.appendChild(htmlLabelMaxBeat);
htmlContainer.appendChild(htmlInputMaxBeat);

const tool: Tool<{ specific: 'difficulty' | 'time'; minTime: number; maxTime: number }> = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_VISION_BLOCK,
        output: ToolOutputOrder.NOTES_VISION_BLOCK,
    },
    input: {
        enabled,
        params: {
            specific: 'difficulty',
            minTime: defaultMinTime,
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
    htmlInputMinBeat.value = round(localBPM.toBeatTime(tool.input.params.minTime), 2).toString();
    htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.maxTime), 2).toString();
}

function inputSpecCheckHandler(this: HTMLInputElement) {
    // FIXME: check for string
    tool.input.params.specific = this.value as 'difficulty' | 'time';
}

function inputMinTimeHandler(this: HTMLInputElement) {
    tool.input.params.minTime = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.minTime * 1000, 1).toString();
    if (localBPM) {
        htmlInputMinBeat.value = round(
            localBPM.toBeatTime(tool.input.params.minTime),
            2,
        ).toString();
        if (tool.input.params.minTime > tool.input.params.maxTime) {
            tool.input.params.maxTime = tool.input.params.minTime;
            htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
            htmlInputMaxBeat.value = round(
                localBPM.toBeatTime(tool.input.params.maxTime),
                2,
            ).toString();
        }
    }
}

function inputMinBeatHandler(this: HTMLInputElement) {
    if (!localBPM) {
        this.value = '0';
        return;
    }
    const val = Math.abs(parseFloat(this.value)) || 1;
    tool.input.params.minTime = localBPM.toRealTime(val);
    htmlInputMinTime.value = round(tool.input.params.minTime * 1000, 1).toString();
    this.value = round(val, 2).toString();
    if (tool.input.params.minTime > tool.input.params.maxTime) {
        tool.input.params.maxTime = tool.input.params.minTime;
        htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
        htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime),
            2,
        ).toString();
    }
}

function inputMaxTimeHandler(this: HTMLInputElement) {
    tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.maxTime * 1000, 1).toString();
    if (localBPM) {
        htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime),
            2,
        ).toString();
    }
}

function inputMaxBeatHandler(this: HTMLInputElement) {
    if (!localBPM) {
        this.value = '0';
        return;
    }
    const val = Math.abs(parseFloat(this.value)) || 1;
    tool.input.params.maxTime = localBPM.toRealTime(val);
    htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
    this.value = round(val, 2).toString();
}

function check(map: ToolArgs) {
    const { bpm, njs } = map.settings;
    const noteContainer = map
        .difficulty!.data.getNoteContainer()
        .filter((n) => n.type !== 'slider');
    const { minTime: temp1, maxTime: temp2, specific: vbSpecific } = tool.input.params;
    const minTime =
        vbSpecific === 'time'
            ? bpm.toBeatTime(temp1)
            : bpm.toBeatTime(vbDiff[map.difficulty!.difficulty].min);
    const maxTime =
        vbSpecific === 'time'
            ? bpm.toBeatTime(temp2)
            : Math.min(njs.hjd, bpm.toBeatTime(vbDiff[map.difficulty!.difficulty].max));

    let lastMidL: NoteContainer | null = null;
    let lastMidR: NoteContainer | null = null;
    const arr: NoteContainer[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        const note = noteContainer[i];
        if (lastMidL) {
            if (
                note.data.time - lastMidL.data.time >= minTime &&
                note.data.time - lastMidL.data.time <= maxTime
            ) {
                if (note.data.posX < PositionX.MIDDLE_RIGHT) {
                    arr.push(note);
                }
            }
            // yeet the last note if nothing else found so we dont have to perform check every note
            else if (note.data.time - lastMidL.data.time > maxTime) {
                lastMidL = null;
            }
        }
        if (lastMidR) {
            if (
                note.data.time - lastMidR.data.time >= minTime &&
                note.data.time - lastMidR.data.time <= maxTime
            ) {
                if (note.data.posX > PositionX.MIDDLE_LEFT) {
                    arr.push(note);
                }
            } else if (note.data.time - lastMidR.data.time > maxTime) {
                lastMidR = null;
            }
        }
        if (note.data.posY === PositionY.MIDDLE && note.data.posX === PositionX.MIDDLE_LEFT) {
            lastMidL = note;
        }
        if (note.data.posY === PositionY.MIDDLE && note.data.posX === PositionX.MIDDLE_RIGHT) {
            lastMidR = note;
        }
    }
    return arr
        .map((n) => n.data.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map);

    if (result.length) {
        tool.output.html = printResultTime('Vision block', result, map.settings.bpm, 'warning');
    } else {
        tool.output.html = null;
    }
}

export default tool;
