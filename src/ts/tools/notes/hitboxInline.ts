import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Hitbox inline';
htmlLabelCheck.htmlFor = 'input__tools-hitbox-inline-check';
htmlInputCheck.id = 'input__tools-hitbox-inline-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Hitbox Inline',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 72,
        output: 192,
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

const constant = 0;
function check(map: ToolArgs) {
    const { bpm, njs } = map.settings;
    const { colorNotes } = map.difficulty.data;

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
        3: [],
    };

    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        const note = colorNotes[i];
        if (lastNote[note.color]) {
            if (
                beatmap.swing.next(
                    note,
                    lastNote[note.color],
                    bpm,
                    swingNoteArray[note.color]
                )
            ) {
                swingNoteArray[note.color] = [];
            }
        }
        for (const other of swingNoteArray[(note.color + 1) % 2]) {
            // magic number 1.425 from saber length + good/bad hitbox
            if (other.type !== 'note') {
                continue;
            }
            if (
                njs.value <
                    1.425 /
                        ((60 * (note.time - other.data.time)) / bpm.value + constant) &&
                note.isInline(other.data)
            ) {
                arr.push(note);
                break;
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
        htmlResult.innerHTML = `<b>Hitbox inline [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
