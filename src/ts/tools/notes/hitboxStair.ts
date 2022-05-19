import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/v3/container';
import { isEnd } from '../../analyzers/placement/note';
import swing from '../../analyzers/swing/swing';
import { ColorNote } from '../../beatmap/v3';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Hitbox staircase';
htmlLabelCheck.htmlFor = 'input__tools-hitbox-stair-check';
htmlInputCheck.id = 'input__tools-hitbox-stair-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Hitbox Staircase',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 70,
        output: 190,
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
    const { bpm } = map.settings;
    const noteContainer = map.difficulty!.noteContainer;
    const hitboxTime = bpm.toBeatTime(0.15);

    const lastNote: { [key: number]: NoteContainerNote } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const lastSpeed: { [key: number]: number } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
    };
    const noteOccupy: { [key: number]: ColorNote } = {
        0: ColorNote.create({ c: 0 }),
        1: ColorNote.create({ c: 1 }),
    };

    // FIXME: use new system
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
                lastSpeed[note.data.color] =
                    note.data.time - lastNote[note.data.color].data.time;
                if (note.data.direction !== 8) {
                    noteOccupy[note.data.color].posX =
                        note.data.posX +
                        beatmap.NoteCutDirectionSpace[note.data.direction][0];
                    noteOccupy[note.data.color].posY =
                        note.data.posY +
                        beatmap.NoteCutDirectionSpace[note.data.direction][1];
                } else {
                    noteOccupy[note.data.color].posX = -1;
                    noteOccupy[note.data.color].posY = -1;
                }
                swingNoteArray[note.data.color] = [];
                lastNoteDirection[note.data.color] = note.data.direction;
            } else if (
                isEnd(
                    note.data,
                    lastNote[note.data.color].data,
                    lastNoteDirection[note.data.color]
                )
            ) {
                if (note.data.direction !== 8) {
                    noteOccupy[note.data.color].posX =
                        note.data.posX +
                        beatmap.NoteCutDirectionSpace[note.data.direction][0];
                    noteOccupy[note.data.color].posY =
                        note.data.posY +
                        beatmap.NoteCutDirectionSpace[note.data.direction][1];
                    lastNoteDirection[note.data.color] = note.data.direction;
                } else {
                    noteOccupy[note.data.color].posX =
                        note.data.posX +
                        beatmap.NoteCutDirectionSpace[
                            lastNoteDirection[note.data.color]
                        ][0];
                    noteOccupy[note.data.color].posY =
                        note.data.posY +
                        beatmap.NoteCutDirectionSpace[
                            lastNoteDirection[note.data.color]
                        ][1];
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
                    note.data.posY === noteOccupy[(note.data.color + 1) % 2].posY
                ) {
                    for (let j = i + 1; j < len; j++) {
                        const compare = noteContainer[j];
                        if (compare.data.time > note.data.time + 0.01) {
                            break;
                        }
                        if (
                            compare.type === 'note' &&
                            note.data.isDouble(compare.data, 0.01)
                        ) {
                            arr.push(note);
                        }
                    }
                }
            }
        } else {
            if (note.data.direction !== 8) {
                noteOccupy[note.data.color].posX =
                    note.data.posX +
                    beatmap.NoteCutDirectionSpace[note.data.direction][0];
                noteOccupy[note.data.color].posY =
                    note.data.posY +
                    beatmap.NoteCutDirectionSpace[note.data.direction][1];
            } else {
                noteOccupy[note.data.color].posX = -1;
                noteOccupy[note.data.color].posY = -1;
            }
            lastNoteDirection[note.data.color] = note.data.direction;
        }
        lastNote[note.data.color] = note;
        swingNoteArray[note.data.color].push(noteContainer[i]);
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
        htmlResult.innerHTML = `<b>Hitbox staircase [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
