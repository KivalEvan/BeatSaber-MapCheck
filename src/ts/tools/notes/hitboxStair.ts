import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

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
    const { bpm } = mapSettings;
    const { colorNotes } = map.difficulty.data;
    const hitboxTime = bpm.toBeatTime(0.15);

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const lastNoteDirection: { [key: number]: number } = {};
    const lastSpeed: { [key: number]: number } = {};
    const swingNoteArray: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
        3: [],
    };
    const noteOccupy: { [key: number]: beatmap.v3.ColorNote } = {
        0: { _time: 0, _type: 0, _cutDirection: 0, _lineIndex: 0, _lineLayer: 0 },
        1: { _time: 0, _type: 1, _cutDirection: 0, _lineIndex: 0, _lineLayer: 0 },
        3: { _time: 0, _type: 3, _cutDirection: 0, _lineIndex: 0, _lineLayer: 0 },
    };

    // FIXME: use new system
    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        const note = colorNotes[i];
        if (note.isNote(note) && lastNote[note._type]) {
            if (
                swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])
            ) {
                lastSpeed[note._type] = note._time - lastNote[note._type]._time;
                if (note._cutDirection !== 8) {
                    noteOccupy[note._type]._lineIndex =
                        note._lineIndex + note.cutDirectionSpace[note._cutDirection][0];
                    noteOccupy[note._type]._lineLayer =
                        note._lineLayer + note.cutDirectionSpace[note._cutDirection][1];
                } else {
                    noteOccupy[note._type]._lineIndex = -1;
                    noteOccupy[note._type]._lineLayer = -1;
                }
                swingNoteArray[note._type] = [];
                lastNoteDirection[note._type] = note._cutDirection;
            } else if (
                note.isEnd(note, lastNote[note._type], lastNoteDirection[note._type])
            ) {
                if (note._cutDirection !== 8) {
                    noteOccupy[note._type]._lineIndex =
                        note._lineIndex + note.cutDirectionSpace[note._cutDirection][0];
                    noteOccupy[note._type]._lineLayer =
                        note._lineLayer + note.cutDirectionSpace[note._cutDirection][1];
                    lastNoteDirection[note._type] = note._cutDirection;
                } else {
                    noteOccupy[note._type]._lineIndex =
                        note._lineIndex +
                        note.cutDirectionSpace[lastNoteDirection[note._type]][0];
                    noteOccupy[note._type]._lineLayer =
                        note._lineLayer +
                        note.cutDirectionSpace[lastNoteDirection[note._type]][1];
                }
            }
            if (
                lastNote[(note._type + 1) % 2] &&
                note._time - lastNote[(note._type + 1) % 2]._time !== 0 &&
                note._time - lastNote[(note._type + 1) % 2]._time <
                    Math.min(hitboxTime, lastSpeed[(note._type + 1) % 2])
            ) {
                if (
                    note._lineIndex === noteOccupy[(note._type + 1) % 2]._lineIndex &&
                    note._lineLayer === noteOccupy[(note._type + 1) % 2]._lineLayer &&
                    !note.isDouble(note, colorNotes, i)
                ) {
                    arr.push(note);
                }
            }
        } else {
            if (note._cutDirection !== 8) {
                noteOccupy[note._type]._lineIndex =
                    note._lineIndex + note.cutDirectionSpace[note._cutDirection][0];
                noteOccupy[note._type]._lineLayer =
                    note._lineLayer + note.cutDirectionSpace[note._cutDirection][1];
            } else {
                noteOccupy[note._type]._lineIndex = -1;
                noteOccupy[note._type]._lineLayer = -1;
            }
            lastNoteDirection[note._type] = note._cutDirection;
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
    }
    return arr
        .map((n) => n._time)
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
