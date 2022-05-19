import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/v3/container';
import UICheckbox from '../../ui/checkbox';
import swing from '../../analyzers/swing/swing';

const name = 'Improper Window Snap';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 60,
        output: 185,
    },
    input: {
        enabled: true,
        params: {},
        html: UICheckbox.create(name, name, true, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

function check(map: ToolArgs) {
    const { bpm } = map.settings;
    const { noteContainer } = map.difficulty!;
    const lastNote: { [key: number]: NoteContainerNote } = {};
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
                lastNote[note.data.color] = note;
                swingNoteArray[note.data.color] = [];
            } else if (
                note.data.isSlantedWindow(lastNote[note.data.color].data) &&
                note.data.time - lastNote[note.data.color].data.time >= 0.001 &&
                note.data.direction === lastNote[note.data.color].data.direction &&
                note.data.direction !== 8 &&
                lastNote[note.data.color].data.direction !== 8
            ) {
                arr.push(lastNote[note.data.color]);
            }
        } else {
            lastNote[note.data.color] = note;
        }
        swingNoteArray[note.data.color].push(note);
    }
    return arr
        .map((n) => n.data.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
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
