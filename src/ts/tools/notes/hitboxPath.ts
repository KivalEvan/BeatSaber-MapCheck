import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { isIntersect } from '../../analyzers/placement/note';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';
import { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote';

const name = 'Hitbox Path';
const description = 'Check for overlapping pre-swing note hitbox at same time.';
const enabled = true;

const tool: Tool<{}> = {
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
    const noteContainer = map.difficulty!.noteContainer.filter((n) => n.type === 'bomb' || n.type === 'note');

    const arr: IWrapColorNote[] = [];
    // to avoid multiple of stack popping up, ignore anything within this time
    let lastTime: number = 0;
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        const currentNote = noteContainer[i];
        if (
            currentNote.type === 'bomb' ||
            currentNote.type === 'slider' ||
            currentNote.type === 'burstSlider' ||
            bpm.toRealTime(currentNote.data.time) < lastTime + 0.01
        ) {
            continue;
        }
        for (let j = i + 1; j < len; j++) {
            const compareTo = noteContainer[j];
            if (bpm.toRealTime(compareTo.data.time) > bpm.toRealTime(currentNote.data.time) + 0.01) {
                break;
            }
            if (compareTo.type === 'note' && currentNote.data.color === compareTo.data.color) {
                continue;
            }
            if (
                ((currentNote.data.isHorizontal(compareTo.data) || currentNote.data.isVertical(compareTo.data)) &&
                    isIntersect(currentNote.data, compareTo.data, [
                        [45, 1],
                        [15, 2],
                    ]).some((b) => b)) ||
                (currentNote.data.isDiagonal(compareTo.data) &&
                    isIntersect(currentNote.data, compareTo.data, [
                        [45, 1],
                        [15, 1.5],
                    ]).some((b) => b))
            ) {
                arr.push(currentNote.data);
                lastTime = bpm.toRealTime(currentNote.data.time);
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
        tool.output.html = printResultTime('Hitbox path', result, map.settings.bpm, 'error');
    } else {
        tool.output.html = null;
    }
}

export default tool;
