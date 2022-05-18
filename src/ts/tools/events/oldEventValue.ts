import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/checkbox';

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

function check(map: ToolArgs) {
    const { basicBeatmapEvents } = map.difficulty.data;

    const arr: beatmap.v3.BasicEvent[] = [];
    if (
        map.difficulty.rawVersion === 2 &&
        map.difficulty.rawData._version !== '2.5.0' &&
        map.difficulty.rawData._version !== '2.6.0'
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
    const result = check(map);

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
