import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm, _njs: njs } = mapSettings;
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
            if (notes[i]._type === notes[j]._type) {
                continue;
            }
            if (
                isIntersect(notes[i], notes[j], 2) &&
                (beatmap.note.isHorizontal(notes[i], notes[j]) ||
                    beatmap.note.isVertical(notes[i], notes[j]))
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

// i dont like this implementation but whatever
function isIntersect(
    n1: beatmap.note.Note,
    n2: beatmap.note.Note,
    maxDistance: number
): boolean {
    for (let i = 1; i <= maxDistance; i++) {
        if (n1._cutDirection !== 8) {
            let noteOccupyLineIndex =
                n1._lineIndex +
                beatmap.note.cutDirectionSpace[
                    beatmap.note.flipDirection[n1._cutDirection]
                ][0] *
                    i;
            let noteOccupyLineLayer =
                n1._lineLayer +
                beatmap.note.cutDirectionSpace[
                    beatmap.note.flipDirection[n1._cutDirection]
                ][1] *
                    i;
            if (
                n2._lineIndex === noteOccupyLineIndex &&
                n2._lineLayer === noteOccupyLineLayer
            ) {
                return true;
            }
        }
        if (n2._cutDirection !== 8) {
            let noteOccupyLineIndex =
                n2._lineIndex +
                beatmap.note.cutDirectionSpace[
                    beatmap.note.flipDirection[n2._cutDirection]
                ][0] *
                    i;
            let noteOccupyLineLayer =
                n2._lineLayer +
                beatmap.note.cutDirectionSpace[
                    beatmap.note.flipDirection[n2._cutDirection]
                ][1] *
                    i;
            if (
                n1._lineIndex === noteOccupyLineIndex &&
                n1._lineLayer === noteOccupyLineLayer
            ) {
                return true;
            }
        }
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
        htmlResult.innerHTML = `<b>Hitbox path [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
