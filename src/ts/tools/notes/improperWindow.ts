import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';
import UICheckbox from '../../ui/checkbox';

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
                swing.next(note, lastNote[note.color], bpm, swingNoteArray[note.color])
            ) {
                lastNote[note.color] = note;
                swingNoteArray[note.color] = [];
            } else if (
                note.isSlantedWindow(lastNote[note.color]) &&
                note.time - lastNote[note.color].time >= 0.001 &&
                note.direction === lastNote[note.color].direction &&
                note.direction !== 8 &&
                lastNote[note.color].direction !== 8
            ) {
                arr.push(lastNote[note.color]);
            }
        } else {
            lastNote[note.color] = note;
        }
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
        htmlResult.innerHTML = `<b>Improper window snap [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
