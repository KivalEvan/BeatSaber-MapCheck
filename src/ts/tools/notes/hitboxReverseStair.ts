import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Hitbox reverse staircase';
htmlLabelCheck.htmlFor = 'input__tools-hitbox-rstair-check';
htmlInputCheck.id = 'input__tools-hitbox-rstair-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Hitbox Reverse Staircase',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 71,
        output: 191,
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

    const lastNote: { [key: number]: beatmap.note.Note } = {};
    const swingNoteArray: { [key: number]: beatmap.note.Note[] } = {
        0: [],
        1: [],
        3: [],
    };

    const arr: beatmap.note.Note[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (beatmap.note.isNote(note) && lastNote[note._type]) {
            if (
                swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])
            ) {
                swingNoteArray[note._type] = [];
            }
        }
        for (const other of swingNoteArray[(note._type + 1) % 2]) {
            if (other._cutDirection !== 8) {
                let noteOccupyLineIndex =
                    other._lineIndex +
                    beatmap.note.cutDirectionSpace[
                        beatmap.note.flipDirection[other._cutDirection]
                    ][0];
                let noteOccupyLineLayer =
                    other._lineLayer +
                    beatmap.note.cutDirectionSpace[
                        beatmap.note.flipDirection[other._cutDirection]
                    ][1];
                if (
                    !(njs.value > bpm.value / (60 * (note._time - other._time))) &&
                    note._lineIndex === noteOccupyLineIndex &&
                    note._lineLayer === noteOccupyLineLayer
                ) {
                    arr.push(other);
                    break;
                }
            }
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

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Hitbox reverse staircase [${
            result.length
        }]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
