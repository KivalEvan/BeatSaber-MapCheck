import { IBeatmapItem, IBeatmapSettings, Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';

const name = 'Stacked Note';
const description = 'Look for stacked note.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_STACKED_NOTE,
        output: ToolOutputOrder.NOTES_STACKED_NOTE,
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

function checkNote(settings: IBeatmapSettings, map: IBeatmapItem) {
    const { bpm } = settings;
    const { colorNotes } = map.data;

    const arr: beatmap.v3.ColorNote[] = [];
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
            if (colorNotes[j].isInline(colorNotes[i])) {
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

function checkBomb(settings: IBeatmapSettings, map: IBeatmapItem) {
    const { bpm, njs } = settings;
    const { bombNotes } = map.data;

    const arr: beatmap.v3.BombNote[] = [];
    for (let i = 0, len = bombNotes.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            // arbitrary break after 1s to not loop too much often
            if (bpm.toRealTime(bombNotes[j].time) > bpm.toRealTime(bombNotes[i].time) + 1) {
                break;
            }
            if (
                bombNotes[i].isInline(bombNotes[j]) &&
                (njs.value < bpm.value / (120 * (bombNotes[j].time - bombNotes[i].time)) ||
                    bpm.toRealTime(bombNotes[j].time) < bpm.toRealTime(bombNotes[i].time) + 0.02)
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
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const resultNote = checkNote(map.settings, map.difficulty);
    const resultBomb = checkBomb(map.settings, map.difficulty);

    const htmlResult: HTMLElement[] = [];
    if (resultNote.length) {
        htmlResult.push(printResultTime('Stacked note', resultNote, map.settings.bpm));
    }
    if (resultBomb.length) {
        htmlResult.push(printResultTime('Stacked bomb', resultBomb, map.settings.bpm));
    }

    if (htmlResult.length) {
        const htmlContainer = document.createElement('div');
        htmlResult.forEach((h) => htmlContainer.append(h));
        tool.output.html = htmlContainer;
    } else {
        tool.output.html = null;
    }
}

export default tool;
