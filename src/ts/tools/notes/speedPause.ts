import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';

const defaultMaxTime = 0.075;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlInputMinTime = document.createElement('input');
const htmlLabelMinTime = document.createElement('label');
const htmlInputMinPrec = document.createElement('input');
const htmlLabelMinPrec = document.createElement('label');

let localBPM!: beatmap.BeatPerMinute;

htmlLabelCheck.textContent = ' Speed pause (EXPERIMENTAL)';
htmlLabelCheck.htmlFor = 'input__tools-speed-pause-check';
htmlInputCheck.id = 'input__tools-speed-pause-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = false;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlLabelMinTime.textContent = 'stream speed (ms): ';
htmlLabelMinTime.htmlFor = 'input__tools-speed-pause-time';
htmlInputMinTime.id = 'input__tools-speed-pause-time';
htmlInputMinTime.className = 'input-toggle input--small';
htmlInputMinTime.type = 'number';
htmlInputMinTime.min = '0';
htmlInputMinTime.value = round(defaultMaxTime * 1000, 1).toString();
htmlInputMinTime.addEventListener('change', inputTimeHandler);

htmlLabelMinPrec.textContent = ' (prec): ';
htmlLabelMinPrec.htmlFor = 'input__tools-speed-pause-prec';
htmlInputMinPrec.id = 'input__tools-speed-pause-prec';
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
    name: 'Speed Pause',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 50,
        output: 180,
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
    htmlInputMinPrec.value = round(
        1 / localBPM.toBeatTime(tool.input.params.maxTime as number),
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
        htmlInputMinPrec.value = round(
            1 / localBPM.toBeatTime(tool.input.params.maxTime as number),
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
    tool.input.params.maxTime = localBPM.toRealTime(1 / val);
    htmlInputMinTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
    this.value = val.toString();
}

function check(map: ToolArgs) {
    const { bpm } = map.settings;
    const { colorNotes } = map.difficulty.data;
    const { maxTime: temp } = <{ maxTime: number }>tool.input.params;
    const maxTime = bpm.toBeatTime(temp) + 0.001;

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const lastNotePause: { [key: number]: beatmap.v3.ColorNote } = {};
    const maybePause: { [key: number]: boolean } = {
        0: false,
        1: false,
        3: false,
    };
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
        3: [],
    };

    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        const note = colorNotes[i];
        if (lastNote[note.color]) {
            if (
                beatmap.swing.next(
                    note,
                    lastNote[note.color],
                    bpm,
                    swingNoteArray[note.color]
                )
            ) {
                if (note.time - lastNote[note.color].time <= maxTime * 2) {
                    if (
                        maybePause[0] &&
                        maybePause[1] &&
                        lastNote[note.color].time - lastNotePause[note.color].time <=
                            maxTime * 3
                    ) {
                        arr.push(lastNote[note.color]);
                    }
                    maybePause[note.color] = false;
                } else if (!maybePause[note.color]) {
                    maybePause[note.color] = true;
                    lastNotePause[note.color] = lastNote[note.color];
                }
                swingNoteArray[note.color] = [];
                lastNote[note.color] = note;
            }
        } else {
            lastNote[note.color] = note;
        }
        swingNoteArray[note.color].push({ type: 'note', data: note });
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
        htmlResult.innerHTML = `<b>Speed pause [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
