import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import { isEnd } from '../../analyzers/placement/note';
import swing from '../../analyzers/swing/swing';
import { ColorNote } from '../../beatmap/v3/colorNote';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';
import { NoteColor, NoteDirection, NoteDirectionSpace } from '../../beatmap/shared/constants';

const name = 'Hitbox Staircase';
const description = 'Check for overlapping post-swing hitbox with note hitbox during swing.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_HITBOX_STAIR,
        output: ToolOutputOrder.NOTES_HITBOX_STAIR,
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

function isDouble(note: NoteContainerNote, nc: NoteContainer[], index: number): boolean {
    for (let i = index, len = nc.length; i < len; i++) {
        if (nc[i].type !== 'note') {
            continue;
        }
        if (nc[i].data.time < note.data.time + 0.01 && (nc[i] as NoteContainerNote).data.color !== note.data.color) {
            return true;
        }
        if (nc[i].data.time > note.data.time + 0.01) {
            return false;
        }
    }
    return false;
}

function check(map: ToolArgs) {
    const { bpm } = map.settings;
    const { noteContainer } = map.difficulty!;
    const hitboxTime = bpm.toBeatTime(0.15);

    const lastNote: { [key: number]: NoteContainerNote } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const lastSpeed: { [key: number]: number } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        [NoteColor.RED]: [],
        [NoteColor.BLUE]: [],
    };
    const noteOccupy: { [key: number]: ColorNote } = {
        [NoteColor.RED]: ColorNote.create()[0],
        [NoteColor.BLUE]: ColorNote.create({ c: 1 })[0],
    };

    // FIXME: use new system
    const arr: NoteContainer[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        if (noteContainer[i].type !== 'note') {
            continue;
        }
        const note = noteContainer[i] as NoteContainerNote;
        if (lastNote[note.data.color]) {
            if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
                lastSpeed[note.data.color] = note.data.time - lastNote[note.data.color].data.time;
                if (note.data.direction !== NoteDirection.ANY) {
                    noteOccupy[note.data.color].posX = note.data.posX + NoteDirectionSpace[note.data.direction][0];
                    noteOccupy[note.data.color].posY = note.data.posY + NoteDirectionSpace[note.data.direction][1];
                } else {
                    noteOccupy[note.data.color].posX = -1;
                    noteOccupy[note.data.color].posY = -1;
                }
                swingNoteArray[note.data.color] = [];
                lastNoteDirection[note.data.color] = note.data.direction;
            } else if (isEnd(note.data, lastNote[note.data.color].data, lastNoteDirection[note.data.color])) {
                if (note.data.direction !== NoteDirection.ANY) {
                    noteOccupy[note.data.color].posX = note.data.posX + NoteDirectionSpace[note.data.direction][0];
                    noteOccupy[note.data.color].posY = note.data.posY + NoteDirectionSpace[note.data.direction][1];
                    lastNoteDirection[note.data.color] = note.data.direction;
                } else {
                    noteOccupy[note.data.color].posX =
                        note.data.posX + NoteDirectionSpace[lastNoteDirection[note.data.color]][0];
                    noteOccupy[note.data.color].posY =
                        note.data.posY + NoteDirectionSpace[lastNoteDirection[note.data.color]][1];
                }
            }
            if (
                lastNote[(note.data.color + 1) % 2] &&
                note.data.time - lastNote[(note.data.color + 1) % 2].data.time !== 0 &&
                note.data.time - lastNote[(note.data.color + 1) % 2].data.time <
                    Math.min(hitboxTime, lastSpeed[(note.data.color + 1) % 2])
            ) {
                if (
                    note.data.posX === noteOccupy[(note.data.color + 1) % 2].posX &&
                    note.data.posY === noteOccupy[(note.data.color + 1) % 2].posY &&
                    !isDouble(note, noteContainer, i)
                ) {
                    arr.push(note);
                }
            }
        } else {
            if (note.data.direction !== NoteDirection.ANY) {
                noteOccupy[note.data.color].posX = note.data.posX + NoteDirectionSpace[note.data.direction][0];
                noteOccupy[note.data.color].posY = note.data.posY + NoteDirectionSpace[note.data.direction][1];
            } else {
                noteOccupy[note.data.color].posX = -1;
                noteOccupy[note.data.color].posY = -1;
            }
            lastNoteDirection[note.data.color] = note.data.direction;
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
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map);

    if (result.length) {
        tool.output.html = printResultTime('Hitbox staircase', result, map.settings.bpm);
    } else {
        tool.output.html = null;
    }
}

export default tool;
