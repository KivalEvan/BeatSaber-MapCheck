import { IBeatmapItem, IBeatmapSettings, Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';
import { checkDirection } from '../../analyzers/placement/note';
import swing from '../../analyzers/swing/swing';
import UICheckbox from '../../ui/checkbox';

const name = 'Double-directional';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 99,
        output: 140,
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

function check(settings: IBeatmapSettings, difficulty: IBeatmapItem) {
    const { bpm } = settings;
    const noteContainer = difficulty.noteContainer;
    const lastNote: { [key: number]: NoteContainer } = {};
    const lastNoteAngle: { [key: number]: number } = {};
    const startNoteDot: { [key: number]: beatmap.v3.ColorNote | null } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
    };

    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        const note = noteContainer[i];
        if (note.type === 'note' && lastNote[note.data.color]) {
            if (
                swing.next(
                    note,
                    lastNote[note.data.color],
                    bpm,
                    swingNoteArray[note.data.color]
                )
            ) {
                if (startNoteDot[note.data.color]) {
                    startNoteDot[note.data.color] = null;
                    lastNoteAngle[note.data.color] =
                        (lastNoteAngle[note.data.color] + 180) % 360;
                }
                if (
                    checkDirection(note.data, lastNoteAngle[note.data.color], 45, true)
                ) {
                    arr.push(note.data);
                }
                if (note.data.direction === 8) {
                    startNoteDot[note.data.color] = note.data;
                } else {
                    lastNoteAngle[note.data.color] = note.data.getAngle();
                }
                swingNoteArray[note.data.color] = [];
            } else {
                if (
                    startNoteDot[note.data.color] &&
                    checkDirection(note.data, lastNoteAngle[note.data.color], 45, true)
                ) {
                    arr.push(note.data);
                    startNoteDot[note.data.color] = null;
                    lastNoteAngle[note.data.color] = note.data.getAngle();
                }
                if (note.data.direction !== 8) {
                    startNoteDot[note.data.color] = null;
                    lastNoteAngle[note.data.color] = note.data.getAngle();
                }
            }
        } else if (note.type === 'note') {
            lastNoteAngle[note.data.color] = note.data.getAngle();
        }
        if (note.type === 'note') {
            lastNote[note.data.color] = note;
            swingNoteArray[note.data.color].push(note);
        }
        if (note.type === 'bomb') {
            // on bottom row
            if (note.data.posY === 0) {
                //on right center
                if (note.data.posX === 1) {
                    lastNoteAngle[0] = beatmap.NoteCutAngle[0];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note.data.posX === 2) {
                    lastNoteAngle[1] = beatmap.NoteCutAngle[0];
                    startNoteDot[1] = null;
                }
                //on top row
            }
            if (note.data.posY === 2) {
                //on right center
                if (note.data.posX === 1) {
                    lastNoteAngle[0] = beatmap.NoteCutAngle[1];
                    startNoteDot[0] = null;
                }
                //on left center
                if (note.data.posX === 2) {
                    lastNoteAngle[1] = beatmap.NoteCutAngle[1];
                    startNoteDot[1] = null;
                }
            }
        }
    }
    return arr
        .map((n) => n.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map.settings, map.difficulty);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Double-directional [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
