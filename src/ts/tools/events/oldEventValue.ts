import { IBeatmapItem, Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/helpers/checkbox';

const name = ' Old value 4 event';

const tool: Tool = {
    name: 'Insufficient Light',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 1,
        output: 1,
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

function check(difficulty: IBeatmapItem) {
    const { basicBeatmapEvents } = difficulty.data;

    const arr: beatmap.v3.BasicEvent[] = [];
    if (
        difficulty.rawVersion === 2 &&
        difficulty.rawData._version !== '2.5.0' &&
        difficulty.rawData._version !== '2.6.0'
    ) {
        for (let i = basicBeatmapEvents.length - 1; i >= 0; i--) {
            if (
                basicBeatmapEvents[i].isLightEvent() &&
                basicBeatmapEvents[i].value === 4
            ) {
                arr.push(basicBeatmapEvents[i]);
            }
        }
    } else {
        return [];
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
    const result = check(map.difficulty);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Event with value 4 [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
