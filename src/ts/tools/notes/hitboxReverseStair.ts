import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

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
    run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

const constant = 0.03414823529;
const constantDiagonal = 0.03414823529;
function check(map: ToolArgs) {
    const { bpm, _njs: njs } = mapSettings;
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
                swingNoteArray[note._type] = [];
            }
        }
        for (const other of swingNoteArray[(note._type + 1) % 2]) {
            if (other._cutDirection !== 8) {
                if (
                    !(bpm.toRealTime(note._time) > bpm.toRealTime(other._time) + 0.01)
                ) {
                    continue;
                }
                const isDiagonal =
                    note.getAngle(other) % 90 > 15 && note.getAngle(other) % 90 < 75;
                // magic number 1.425 from saber length + good/bad hitbox
                if (
                    njs.value <
                        1.425 /
                            ((60 * (note._time - other._time)) / bpm.value +
                                (isDiagonal ? constantDiagonal : constant)) &&
                    note.isIntersect(note, other, [[15, 1.5]])[1]
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

function run(map: ToolArgs) {
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Hitbox reverse staircase [${
            result.length
        }]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
