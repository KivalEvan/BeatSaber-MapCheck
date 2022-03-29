import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { NoteContainer } from '../../types/beatmap/v3/container';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Stacked note';
htmlLabelCheck.htmlFor = 'input__tools-stack-note-check';
htmlInputCheck.id = 'input__tools-stack-note-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Stacked Note',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 98,
        output: 198,
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

function checkNote(map: ToolArgs) {
    const { bpm } = map.settings;
    const noteContainer = map.difficulty.noteContainer;

    const arr: NoteContainer[] = [];
    // to avoid multiple of stack popping up, ignore anything within this time
    let lastTime: number = 0;
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        if (bpm.toRealTime(noteContainer[i].data.time) < lastTime + 0.01) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (
                bpm.toRealTime(noteContainer[j].data.time) >
                bpm.toRealTime(noteContainer[i].data.time) + 0.01
            ) {
                break;
            }
            if (noteContainer[j].data.isInline(noteContainer[i].data)) {
                arr.push(noteContainer[i]);
                lastTime = bpm.toRealTime(noteContainer[i].data.time);
            }
        }
    }
    return arr
        .map((n) => n.data.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function checkBomb(map: ToolArgs) {
    const { bpm, njs } = map.settings;
    const { bombNotes } = map.difficulty.data;

    const arr: beatmap.v3.BombNote[] = [];
    for (let i = 0, len = bombNotes.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            // arbitrary break after 1s to not loop too much often
            if (
                bpm.toRealTime(bombNotes[j].time) >
                bpm.toRealTime(bombNotes[i].time) + 1
            ) {
                break;
            }
            if (
                bombNotes[i].isInline(bombNotes[j]) &&
                (njs.value <
                    bpm.value / (120 * (bombNotes[j].time - bombNotes[i].time)) ||
                    bpm.toRealTime(bombNotes[j].time) <
                        bpm.toRealTime(bombNotes[i].time) + 0.02)
            ) {
                arr.push(bombNotes[i]);
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
    const resultNote = checkNote(map);
    const resultBomb = checkBomb(map);

    const htmlString: string[] = [];
    if (resultNote.length) {
        htmlString.push(
            `<b>Stacked note [${resultNote.length}]:</b> ${resultNote
                .map((n) => round(map.settings.bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (resultBomb.length) {
        htmlString.push(
            `<b>Stacked bomb [${resultBomb.length}]:</b> ${resultBomb
                .map((n) => round(map.settings.bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }

    if (htmlString.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = htmlString.join('<br>');
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
