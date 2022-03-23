import { Tool, ToolArgs } from '../../types/mapcheck';
import * as beatmap from '../../beatmap';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Insufficient lighting event';
htmlLabelCheck.htmlFor = 'input__tools-insufficient-light-check';
htmlInputCheck.id = 'input__tools-insufficient-light-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Insufficient Light',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 0,
        output: 0,
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
