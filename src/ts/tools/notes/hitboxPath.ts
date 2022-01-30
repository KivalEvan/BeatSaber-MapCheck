import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Hitbox path';
htmlLabelCheck.htmlFor = 'input__tools-hitbox-path-check';
htmlInputCheck.id = 'input__tools-hitbox-path-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Hitbox Path',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 74,
        output: 190,
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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.types.set.BeatmapSetData) {
    const { _bpm: bpm, _njs: njs } = mapSettings;
    const { _notes: notes } = mapSet._data;

    const arr: beatmap.types.note.Note[] = [];
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
            if (notes[i]._type === notes[j]._type || notes[j]._type === 3) {
                continue;
            }
            if (
                ((beatmap.note.isHorizontal(notes[i], notes[j]) ||
                    beatmap.note.isVertical(notes[i], notes[j])) &&
                    beatmap.note
                        .isIntersect(notes[i], notes[j], [
                            [45, 1],
                            [15, 2],
                        ])
                        .some((b) => b)) ||
                (beatmap.note.isDiagonal(notes[i], notes[j]) &&
                    beatmap.note
                        .isIntersect(notes[i], notes[j], [
                            [45, 1],
                            [15, 1.5],
                        ])
                        .some((b) => b))
            ) {
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

function run(
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.set.BeatmapSetData
): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Hitbox path [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
