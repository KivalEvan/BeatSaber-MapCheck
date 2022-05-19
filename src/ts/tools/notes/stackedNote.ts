import { IBeatmapItem, IBeatmapSettings, Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/checkbox';

const name = 'Stacked Note';

const tool: Tool = {
    name: 'Stacked Note',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 98,
        output: 198,
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
            if (
                bpm.toRealTime(colorNotes[j].time) >
                bpm.toRealTime(colorNotes[i].time) + 0.01
            ) {
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
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const resultNote = checkNote(map.settings, map.difficulty);
    const resultBomb = checkBomb(map.settings, map.difficulty);

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
