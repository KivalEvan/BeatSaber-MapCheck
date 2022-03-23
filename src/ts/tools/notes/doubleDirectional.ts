import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

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
    run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function check(map: ToolArgs) {
    const { bpm } = mapSettings;
    const { colorNotes } = map.difficulty.data;
    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const lastNoteAngle: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.v3.ColorNote | null } = {};
    const swingNoteArray: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
        3: [],
    };

    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        const note = colorNotes[i];
        if (note.isNote(note) && lastNote[note.color]) {
            if (
                swing.next(note, lastNote[note.color], bpm, swingNoteArray[note.color])
            ) {
                if (startNoteDot[note.color]) {
                    startNoteDot[note.color] = null;
                    lastNoteAngle[note.color] = (lastNoteAngle[note.color] + 180) % 360;
                }
                if (note.checkDirection(note, lastNoteAngle[note.color], 45, true)) {
                    arr.push(note);
                }
                if (note._cutDirection === 8) {
                    startNoteDot[note.color] = note;
                } else {
                    lastNoteAngle[note.color] = note.getAngle(note);
                }
                swingNoteArray[note.color] = [];
            } else {
                if (
                    startNoteDot[note.color] &&
                    note.checkDirection(note, lastNoteAngle[note.color], 45, true)
                ) {
                    arr.push(note);
                    startNoteDot[note.color] = null;
                    lastNoteAngle[note.color] = note.getAngle(note);
                }
                if (note._cutDirection !== 8) {
                    startNoteDot[note.color] = null;
                    lastNoteAngle[note.color] = note.getAngle(note);
                }
            }
        } else {
            lastNoteAngle[note.color] = note.getAngle(note);
        }
        lastNote[note.color] = note;
        swingNoteArray[note.color].push(note);
        if (note.color === 3) {
            // on bottom row
            if (note._lineLayer === 0) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteAngle[0] = note.cutAngle[0];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteAngle[1] = note.cutAngle[0];
                    startNoteDot[1] = null;
                }
                //on top row
            }
            if (note._lineLayer === 2) {
                //on right center
                if (note._lineIndex === 1) {
                    lastNoteAngle[0] = note.cutAngle[1];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note._lineIndex === 2) {
                    lastNoteAngle[1] = note.cutAngle[1];
                    startNoteDot[1] = null;
                }
            }
        }
    }
    return arr
        .map((n) => n.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Double-directional [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
