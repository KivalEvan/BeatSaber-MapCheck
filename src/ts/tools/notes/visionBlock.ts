import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const defaultMinTime = 0.1;
const defaultMaxTime = 0.5;

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

let localBPM!: beatmap.bpm.BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
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

htmlLabelCheck.textContent = ' Vision block';
htmlLabelCheck.htmlFor = 'input__tools-vb-check';
htmlInputCheck.id = 'input__tools-vb-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

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

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);
htmlContainer.appendChild(document.createElement('br'));
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

const tool: Tool = {
    name: 'Slow Slider',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 100,
        output: 120,
    },
    input: {
        enabled: htmlInputCheck.checked,
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
    run: run,
};

function adjustTimeHandler(bpm: beatmap.bpm.BeatPerMinute) {
    localBPM = bpm;
    htmlInputMinBeat.value = round(
        localBPM.toBeatTime(tool.input.params.minTime as number),
        2
    ).toString();
    htmlInputMaxBeat.value = round(
        localBPM.toBeatTime(tool.input.params.maxTime as number),
        2
    ).toString();
}

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function inputSpecCheckHandler(this: HTMLInputElement) {
    tool.input.params.specific = this.value;
}

function inputMinTimeHandler(this: HTMLInputElement) {
    tool.input.params.minTime = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.minTime * 1000, 1).toString();
    if (localBPM) {
        htmlInputMinBeat.value = round(
            localBPM.toBeatTime(tool.input.params.minTime as number),
            2
        ).toString();
        if (tool.input.params.minTime > tool.input.params.maxTime) {
            tool.input.params.maxTime = tool.input.params.minTime;
            htmlInputMaxTime.value = round(
                (tool.input.params.maxTime as number) * 1000,
                1
            ).toString();
            htmlInputMaxBeat.value = round(
                localBPM.toBeatTime(tool.input.params.maxTime as number),
                2
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
        htmlInputMaxTime.value = round(
            (tool.input.params.maxTime as number) * 1000,
            1
        ).toString();
        htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime as number),
            2
        ).toString();
    }
}

function inputMaxTimeHandler(this: HTMLInputElement) {
    tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.maxTime * 1000, 1).toString();
    if (localBPM) {
        htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime as number),
            2
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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.types.BeatmapSetData) {
    const { _bpm: bpm, _njs: njs } = mapSettings;
    const { _notes: notes } = mapSet._data;
    const {
        minTime: temp1,
        maxTime: temp2,
        specific: vbSpecific,
    } = <{ minTime: number; maxTime: number; specific: string }>tool.input.params;
    const minTime =
        vbSpecific === 'time'
            ? bpm.toBeatTime(temp1)
            : bpm.toBeatTime(vbDiff[mapSet._difficulty].min);
    const maxTime =
        vbSpecific === 'time'
            ? bpm.toBeatTime(temp2)
            : Math.min(njs.hjd, bpm.toBeatTime(vbDiff[mapSet._difficulty].max));

    let lastMidL!: beatmap.v2.types.Note | null;
    let lastMidR!: beatmap.v2.types.Note | null;
    const arr: beatmap.v2.types.Note[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (lastMidL) {
            if (
                note._time - lastMidL._time >= minTime &&
                note._time - lastMidL._time <= maxTime
            ) {
                if (note._lineIndex < 2) {
                    arr.push(note);
                }
            }
            // yeet the last note if nothing else found so we dont have to perform check every note
            else if (note._time - lastMidL._time > maxTime) {
                lastMidL = null;
            }
        }
        if (lastMidR) {
            if (
                note._time - lastMidR._time >= minTime &&
                note._time - lastMidR._time <= maxTime
            ) {
                if (note._lineIndex > 1) {
                    arr.push(note);
                }
            } else if (note._time - lastMidR._time > maxTime) {
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
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.BeatmapSetData
): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Vision block [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
