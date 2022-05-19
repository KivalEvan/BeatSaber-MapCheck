import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/v3/container';
import swing from '../../analyzers/swing/swing';

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
    const { noteContainer } = map.difficulty!;

    const lastNote: { [key: number]: NoteContainer } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
        3: [],
    };

    const arr: NoteContainer[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        if (noteContainer[i].type !== 'note') {
            continue;
        }
        const note = noteContainer[i] as NoteContainerNote;
        if (lastNote[note.data.color]) {
            if (
                swing.next(
                    note,
                    lastNote[note.data.color],
                    bpm,
                    swingNoteArray[note.data.color]
                )
            ) {
                swingNoteArray[note.data.color] = [];
            }
        }
        for (const other of swingNoteArray[(note.data.color + 1) % 2]) {
            // magic number 1.425 from saber length + good/bad hitbox
            if (other.type !== 'note') {
                continue;
            }
            if (
                njs.value <
                    1.425 /
                        ((60 * (note.data.time - other.data.time)) / bpm.value +
                            constant) &&
                note.data.isInline(other.data)
            ) {
                arr.push(note);
                break;
            }
        }
        lastNote[note.data.color] = note;
        swingNoteArray[note.data.color].push(note);
    }
    return arr
        .map((n) => n.data.time)
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
