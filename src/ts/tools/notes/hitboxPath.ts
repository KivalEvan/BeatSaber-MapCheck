import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { isIntersect } from '../../analyzers/placement/note';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';
import { ColorNote } from '../../beatmap/v3/colorNote';

const name = 'Hitbox Path';
const description = 'Check for overlapping pre-swing note hitbox at same time.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_HITBOX_PATH,
        output: ToolOutputOrder.NOTES_HITBOX_PATH,
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

function check(map: ToolArgs) {
    const { bpm } = map.settings;
    const { colorNotes } = map.difficulty!.data;

    const arr: ColorNote[] = [];
    // to avoid multiple of stack popping up, ignore anything within this time
    let lastTime: number = 0;
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        if (bpm.toRealTime(colorNotes[i].time) < lastTime + 0.01) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            if (bpm.toRealTime(colorNotes[j].time) > bpm.toRealTime(colorNotes[i].time) + 0.01) {
                break;
            }
            if (colorNotes[i].color === colorNotes[j].color) {
                continue;
            }
            if (
                ((colorNotes[i].isHorizontal(colorNotes[j]) || colorNotes[i].isVertical(colorNotes[j])) &&
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
        tool.output.html = printResultTime('Hitbox path', result, map.settings.bpm);
    } else {
        tool.output.html = null;
    }
}

export default tool;
