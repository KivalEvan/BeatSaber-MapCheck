import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';
import { round } from '../../utils';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Zero width/duration obstacle';
htmlLabelCheck.htmlFor = 'input__tools-zero-obstacle-check';
htmlInputCheck.id = 'input__tools-zero-obstacle-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Negative Obstacle',
    description: 'Placeholder',
    type: 'obstacle',
    order: {
        input: 20,
        output: 70,
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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.types.BeatmapSetData) {
    const { _obstacles: obstacles } = mapSet._data;
    return obstacles
        .filter((o) => o._width === 0 || o._duration === 0)
        .map((o) => o._time);
}

function run(
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.BeatmapSetData
): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Zero width/duration obstacle [${
            result.length
        }]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
