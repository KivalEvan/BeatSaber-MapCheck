import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';
import { isEnd } from '../../analyzers/placement/placements';

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
    const noteContainer = map.difficulty.noteContainer;
    const hitboxTime = bpm.toBeatTime(0.15);

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const lastSpeed: { [key: number]: number } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
    };
    const noteOccupy: { [key: number]: beatmap.v3.ColorNote } = {
        0: beatmap.v3.ColorNote.create({ c: 0 }),
        1: beatmap.v3.ColorNote.create({ c: 1 }),
    };

    // FIXME: use new system
    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        const noteData = noteContainer[i];
        if (noteData.type !== 'note') {
            continue;
        }
        const note = noteData.data;
        if (lastNote[note.color]) {
            if (
                swing.next(note, lastNote[note.color], bpm, swingNoteArray[note.color])
            ) {
                lastSpeed[note.color] = note.time - lastNote[note.color].time;
                if (note.direction !== 8) {
                    noteOccupy[note.color].posX =
                        note.posX + beatmap.NoteCutDirectionSpace[note.direction][0];
                    noteOccupy[note.color].posY =
                        note.posY + beatmap.NoteCutDirectionSpace[note.direction][1];
                } else {
                    noteOccupy[note.color].posX = -1;
                    noteOccupy[note.color].posY = -1;
                }
                swingNoteArray[note.color] = [];
                lastNoteDirection[note.color] = note.direction;
            } else if (
                isEnd(note, lastNote[note.color], lastNoteDirection[note.color])
            ) {
                if (note.direction !== 8) {
                    noteOccupy[note.color].posX =
                        note.posX + beatmap.NoteCutDirectionSpace[note.direction][0];
                    noteOccupy[note.color].posY =
                        note.posY + beatmap.NoteCutDirectionSpace[note.direction][1];
                    lastNoteDirection[note.color] = note.direction;
                } else {
                    noteOccupy[note.color].posX =
                        note.posX +
                        beatmap.NoteCutDirectionSpace[lastNoteDirection[note.color]][0];
                    noteOccupy[note.color].posY =
                        note.posY +
                        beatmap.NoteCutDirectionSpace[lastNoteDirection[note.color]][1];
                }
            }
            if (
                lastNote[(note.color + 1) % 2] &&
                note.time - lastNote[(note.color + 1) % 2].time !== 0 &&
                note.time - lastNote[(note.color + 1) % 2].time <
                    Math.min(hitboxTime, lastSpeed[(note.color + 1) % 2])
            ) {
                if (
                    note.posX === noteOccupy[(note.color + 1) % 2].posX &&
                    note.posY === noteOccupy[(note.color + 1) % 2].posY
                ) {
                    for (let j = i + 1; j < len; j++) {
                        const compare = noteContainer[j];
                        if (compare.data.time > note.time + 0.01) {
                            break;
                        }
                        if (
                            compare.type === 'note' &&
                            note.isDouble(compare.data, 0.01)
                        ) {
                            arr.push(note);
                        }
                    }
                }
            }
        } else {
            if (note.direction !== 8) {
                noteOccupy[note.color].posX =
                    note.posX + beatmap.NoteCutDirectionSpace[note.direction][0];
                noteOccupy[note.color].posY =
                    note.posY + beatmap.NoteCutDirectionSpace[note.direction][1];
            } else {
                noteOccupy[note.color].posX = -1;
                noteOccupy[note.color].posY = -1;
            }
            lastNoteDirection[note.color] = note.direction;
        }
        lastNote[note.color] = note;
        swingNoteArray[note.color].push(noteContainer[i]);
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
        htmlResult.innerHTML = `<b>Hitbox staircase [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
