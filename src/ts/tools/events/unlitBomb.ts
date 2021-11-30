import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Unlit bomb';
htmlLabelCheck.htmlFor = 'input__tools-unlit-bomb';
htmlInputCheck.id = 'input__tools-unlit-bomb';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Unlit Bomb',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 3,
        output: 3,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {},
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run: run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

const sufficientLight = (events: beatmap.event.Event[]): boolean => {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--) {
        if (
            beatmap.event.isLightEvent(events[i]) &&
            events[i]._value !== 0 &&
            events[i]._value !== 4
        ) {
            count++;
            if (count > 10) {
                return true;
            }
        }
    }
    return false;
};

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = sufficientLight(mapSet._data._events);

    if (!result) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Insufficient lighting event</b>`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
