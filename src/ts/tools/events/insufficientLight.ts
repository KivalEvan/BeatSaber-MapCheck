import { Tool, ToolArgs } from '../../types/mapcheck';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/checkbox';

const name = ' Insufficient Lighting Event';

const tool: Tool = {
    name: 'Insufficient Light',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 0,
        output: 0,
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

const sufficientLight = (events: beatmap.v3.BasicEvent[]): boolean => {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].isLightEvent() && !events[i].isOff()) {
            count++;
            if (count > 10) {
                return true;
            }
        }
    }
    return false;
};

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = sufficientLight(map.difficulty.data.basicBeatmapEvents);

    if (!result) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Insufficient lighting event</b>`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
