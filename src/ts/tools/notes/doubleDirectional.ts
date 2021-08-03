import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

const defaultSpeed = 0.025;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

let localBPM!: beatmap.bpm.BeatPerMinute;

htmlLabelCheck.textContent = ' Double-directional';
htmlLabelCheck.htmlFor = 'input__tools-dd-check';
htmlInputCheck.id = 'input__tools-dd-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Slow Slider',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 0,
        output: 0,
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
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;
    const lastNote: { [key: number]: beatmap.note.Note } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.note.Note | null } = {};
    const swingNoteArray: { [key: number]: beatmap.note.Note[] } = {
        0: [],
        1: [],
        3: [],
    };
    const arr: beatmap.note.Note[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (beatmap.note.isNote(note) && lastNote[note._type]) {
            if (swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] =
                        beatmap.note.flipDirection[lastNoteDirection[note._type]];
                }
                if (beatmap.note.checkDirection(note, lastNoteDirection[note._type], 45, true)) {
                    arr.push(note);
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note._type] = note;
                } else {
                    lastNoteDirection[note._type] = note._cutDirection;
                }
                swingNoteArray[note._type] = [];
            } else {
                if (
                    startNoteDot[note._type] &&
                    beatmap.note.checkDirection(note, lastNoteDirection[note._type], 45, true)
                ) {
                    arr.push(note);
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = note._cutDirection;
                }
                if (note._cutDirection !== 8) {
                    startNoteDot[note._type] = null;
                    lastNoteDirection[note._type] = note._cutDirection;
                }
            }
        } else {
            lastNoteDirection[note._type] = note._cutDirection;
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
        if (note._type === 3) {
            // on bottom row
            if (note._lineLayer === 0) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteDirection[0] = 0;
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteDirection[1] = 0;
                    startNoteDot[1] = null;
                }
                //on top row
            }
            if (note._lineLayer === 2) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteDirection[0] = 1;
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteDirection[1] = 1;
                    startNoteDot[1] = null;
                }
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
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Double-directional [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
