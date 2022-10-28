import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import swing from '../../analyzers/swing/swing';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';
import { NoteColor } from '../../beatmap/shared/constants';

const name = 'Hitbox Inline';
const description = 'Check for overlapping note hitbox for inline note.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_HITBOX_INLINE,
        output: ToolOutputOrder.NOTES_HITBOX_INLINE,
    },
    input: {
        enabled,
        params: {},
        html: UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

const constant = 0;
function check(map: ToolArgs) {
    const { bpm, njs } = map.settings;
    const { noteContainer } = map.difficulty!;

    const lastNote: { [key: number]: NoteContainer } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        [NoteColor.RED]: [],
        [NoteColor.BLUE]: [],
    };

    const arr: NoteContainer[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        if (noteContainer[i].type !== 'note') {
            continue;
        }
        const note = noteContainer[i] as NoteContainerNote;
        if (lastNote[note.data.color]) {
            if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
                swingNoteArray[note.data.color] = [];
            }
        }
        for (const other of swingNoteArray[(note.data.color + 1) % 2]) {
            // magic number 1.425 from saber length + good/bad hitbox
            if (other.type !== 'note') {
                continue;
            }
            if (
                njs.value < 1.425 / ((60 * (note.data.time - other.data.time)) / bpm.value + constant) &&
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
        tool.output.html = printResultTime('Hitbox inline', result, map.settings.bpm);
    } else {
        tool.output.html = null;
    }
}

export default tool;
