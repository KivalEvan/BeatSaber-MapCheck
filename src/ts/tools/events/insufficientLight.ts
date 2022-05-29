import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/helpers/checkbox';

const name = 'Insufficient Lighting Event';
const description = 'Check for event';

const tool: Tool = {
    name,
    description,
    type: 'event',
    order: {
        input: ToolInputOrder.EVENTS_INSUFFICIENT_LIGHT,
        output: ToolOutputOrder.EVENTS_INSUFFICIENT_LIGHT,
    },
    input: {
        enabled: true,
        params: {},
        html: UICheckbox.create(name, description, true, function (this: HTMLInputElement) {
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
