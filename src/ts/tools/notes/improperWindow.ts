import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Improper window snap';
htmlLabelCheck.htmlFor = 'input__tools-window-snap-check';
htmlInputCheck.id = 'input__tools-window-snap-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Improper Window Snap',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 60,
        output: 185,
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
    const swingNoteArray: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
        3: [],
    };

    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (note.isNote(note) && lastNote[note._type]) {
            if (
                swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])
            ) {
                lastNote[note._type] = note;
                swingNoteArray[note._type] = [];
            } else if (
                note.isSlantedWindow(note, lastNote[note._type]) &&
                note._time - lastNote[note._type]._time >= 0.001 &&
                note._cutDirection === lastNote[note._type]._cutDirection &&
                note._cutDirection !== 8 &&
                lastNote[note._type]._cutDirection !== 8
            ) {
                arr.push(lastNote[note._type]);
            }
        } else {
            lastNote[note._type] = note;
        }
        swingNoteArray[note._type].push(note);
    }
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Improper window snap [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
