import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Hitbox path';
htmlLabelCheck.htmlFor = 'input__tools-hitbox-path-check';
htmlInputCheck.id = 'input__tools-hitbox-path-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Hitbox Path',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 74,
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
    const { bpm, _njs: njs } = map.settings;
    const { colorNotes } = map.difficulty.data;

    const arr: beatmap.v3.ColorNote[] = [];
    // to avoid multiple of stack popping up, ignore anything within this time
    let lastTime: number = 0;
    for (let i = 0, len = notes.length; i < len; i++) {
        if (bpm.toRealTime(notes[i].time) < lastTime + 0.01 || notes[i].color === 3) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (bpm.toRealTime(notes[j].time) > bpm.toRealTime(notes[i].time) + 0.01) {
                break;
            }
            if (notes[i].color === notes[j].color || notes[j].color === 3) {
                continue;
            }
            if (
                ((note.isHorizontal(notes[i], notes[j]) ||
                    note.isVertical(notes[i], notes[j])) &&
                    note
                        .isIntersect(notes[i], notes[j], [
                            [45, 1],
                            [15, 2],
                        ])
                        .some((b) => b)) ||
                (note.isDiagonal(notes[i], notes[j]) &&
                    note
                        .isIntersect(notes[i], notes[j], [
                            [45, 1],
                            [15, 1.5],
                        ])
                        .some((b) => b))
            ) {
                arr.push(notes[i]);
                lastTime = bpm.toRealTime(notes[i].time);
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
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Hitbox path [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
