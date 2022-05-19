import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { isIntersect } from '../../analyzers/placement/note';
import UICheckbox from '../../ui/checkbox';

const name = 'Hitbox Path';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 74,
        output: 190,
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
    const { colorNotes } = map.difficulty!.data;

    const arr: beatmap.v3.ColorNote[] = [];
    // to avoid multiple of stack popping up, ignore anything within this time
    let lastTime: number = 0;
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        if (bpm.toRealTime(colorNotes[i].time) < lastTime + 0.01) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (
                bpm.toRealTime(colorNotes[j].time) >
                bpm.toRealTime(colorNotes[i].time) + 0.01
            ) {
                break;
            }
            if (colorNotes[i].color === colorNotes[j].color) {
                continue;
            }
            if (
                ((colorNotes[i].isHorizontal(colorNotes[j]) ||
                    colorNotes[i].isVertical(colorNotes[j])) &&
                    isIntersect(colorNotes[i], colorNotes[j], [
                        [45, 1],
                        [15, 2],
                    ]).some((b) => b)) ||
                (colorNotes[i].isDiagonal(colorNotes[j]) &&
                    isIntersect(colorNotes[i], colorNotes[j], [
                        [45, 1],
                        [15, 1.5],
                    ]).some((b) => b))
            ) {
                arr.push(colorNotes[i]);
                lastTime = bpm.toRealTime(colorNotes[i].time);
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
