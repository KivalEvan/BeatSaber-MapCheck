import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

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
    name: 'Double-directional',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 99,
        output: 140,
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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.types.BeatmapSetData) {
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;
    const lastNote: { [key: number]: beatmap.types.open.Note } = {};
    const lastNoteAngle: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.types.open.Note | null } = {};
    const swingNoteArray: { [key: number]: beatmap.types.open.Note[] } = {
        0: [],
        1: [],
        3: [],
    };

    const arr: beatmap.types.open.Note[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (beatmap.v2.note.isNote(note) && lastNote[note._type]) {
            if (
                beatmap.v2.swing.next(
                    note,
                    lastNote[note._type],
                    bpm,
                    swingNoteArray[note._type]
                )
            ) {
                if (startNoteDot[note._type]) {
                    startNoteDot[note._type] = null;
                    lastNoteAngle[note._type] = (lastNoteAngle[note._type] + 180) % 360;
                }
                if (
                    beatmap.v2.note.checkDirection(
                        note,
                        lastNoteAngle[note._type],
                        45,
                        true
                    )
                ) {
                    arr.push(note);
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note._type] = note;
                } else {
                    lastNoteAngle[note._type] = beatmap.v2.note.getAngle(note);
                }
                swingNoteArray[note._type] = [];
            } else {
                if (
                    startNoteDot[note._type] &&
                    beatmap.v2.note.checkDirection(
                        note,
                        lastNoteAngle[note._type],
                        45,
                        true
                    )
                ) {
                    arr.push(note);
                    startNoteDot[note._type] = null;
                    lastNoteAngle[note._type] = beatmap.v2.note.getAngle(note);
                }
                if (note._cutDirection !== 8) {
                    startNoteDot[note._type] = null;
                    lastNoteAngle[note._type] = beatmap.v2.note.getAngle(note);
                }
            }
        } else {
            lastNoteAngle[note._type] = beatmap.v2.note.getAngle(note);
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
        if (note._type === 3) {
            // on bottom row
            if (note._lineLayer === 0) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteAngle[0] = beatmap.v2.note.cutAngle[0];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteAngle[1] = beatmap.v2.note.cutAngle[0];
                    startNoteDot[1] = null;
                }
                //on top row
            }
            if (note._lineLayer === 2) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteAngle[0] = beatmap.v2.note.cutAngle[1];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteAngle[1] = beatmap.v2.note.cutAngle[1];
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
        htmlResult.innerHTML = `<b>Double-directional [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
