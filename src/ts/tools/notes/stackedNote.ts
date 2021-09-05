import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Stacked note';
htmlLabelCheck.htmlFor = 'input__tools-stack-note-check';
htmlInputCheck.id = 'input__tools-stack-note-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Stacked Note',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 98,
        output: 198,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {},
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run: run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function checkNote(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;

    const arr: beatmap.note.Note[] = [];
    // to avoid multiple of stack popping up, ignore anything within this time
    let lastTime: number = 0;
    for (let i = 0, len = notes.length; i < len; i++) {
        if (bpm.toRealTime(notes[i]._time) < lastTime + 0.01 || notes[i]._type === 3) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (
                bpm.toRealTime(notes[j]._time) >
                bpm.toRealTime(notes[i]._time) + 0.01
            ) {
                break;
            }
            if (beatmap.note.isInline(notes[i], notes[j])) {
                arr.push(notes[i]);
                lastTime = bpm.toRealTime(notes[i]._time);
            }
        }
    }
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function checkBomb(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm, _njs: njs } = mapSettings;
    const { _notes: notes } = mapSet._data;

    const arr: beatmap.note.Note[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        if (notes[i]._type !== 3) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (
                bpm.toRealTime(notes[j]._time) >=
                    bpm.toRealTime(notes[i]._time) + 0.02 ||
                njs.value > bpm.value / (120 * (notes[j]._time - notes[i]._time))
            ) {
                break;
            }
            if (beatmap.note.isInline(notes[i], notes[j])) {
                arr.push(notes[i]);
            }
        }
    }
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const resultNote = checkNote(mapSettings, mapSet);
    const resultBomb = checkBomb(mapSettings, mapSet);

    const htmlString: string[] = [];
    if (resultNote.length) {
        htmlString.push(
            `<b>Stacked note [${resultNote.length}]:</b> ${resultNote
                .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (resultBomb.length) {
        htmlString.push(
            `<b>Stacked bomb [${resultBomb.length}]:</b> ${resultBomb
                .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }

    if (htmlString.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = htmlString.join('<br>');
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
