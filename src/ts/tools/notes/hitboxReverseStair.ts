import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';
import { isIntersect } from '../../analyzers/placement/placements';

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
    const { bpm, njs } = map.settings;
    const { colorNotes } = map.difficulty.data;

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
    };

    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        const note = colorNotes[i];
        if (lastNote[note.color]) {
            if (
                swing.next(note, lastNote[note.color], bpm, swingNoteArray[note.color])
            ) {
                swingNoteArray[note.color] = [];
            }
        }
        for (const other of swingNoteArray[(note.color + 1) % 2]) {
            if (other.type !== 'note') {
                continue;
            }
            if (other.data.direction !== 8) {
                if (
                    !(
                        bpm.toRealTime(note.time) >
                        bpm.toRealTime(other.data.time) + 0.01
                    )
                ) {
                    continue;
                }
                const isDiagonal =
                    other.data.getAngle() % 90 > 15 && other.data.getAngle() % 90 < 75;
                // magic number 1.425 from saber length + good/bad hitbox
                if (
                    njs.value <
                        1.425 /
                            ((60 * (note.time - other.data.time)) / bpm.value +
                                (isDiagonal ? constantDiagonal : constant)) &&
                    isIntersect(note, other.data, [[15, 1.5]])[1]
                ) {
                    arr.push(other.data);
                    break;
                }
            }
        }
        lastNote[note.color] = note;
        swingNoteArray[note.color].push({ type: 'note', data: note });
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
