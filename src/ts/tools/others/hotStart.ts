import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const defaultTime = 1.5;

const htmlContainer = document.createElement('div');
const htmlInputTime = document.createElement('input');
const htmlLabelTime = document.createElement('label');

htmlLabelTime.textContent = 'Hot start (s): ';
htmlLabelTime.htmlFor = 'input__tools-hot-start';
htmlInputTime.id = 'input__tools-hot-start';
htmlInputTime.className = 'input-toggle input--small';
htmlInputTime.type = 'number';
htmlInputTime.min = '0';
htmlInputTime.step = '0.1';
htmlInputTime.value = defaultTime.toString();
htmlInputTime.addEventListener('change', inputTimeHandler);

htmlContainer.appendChild(htmlLabelTime);
htmlContainer.appendChild(htmlInputTime);

const tool: Tool = {
    name: 'Hot Start',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        enabled: true,
        params: {
            time: defaultTime,
        },
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run: run,
};

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.time = round(Math.abs(parseFloat(this.value)), 3);
    this.value = tool.input.params.time.toString();
}

function run(
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.set.BeatmapSetData
): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const { time } = <{ time: number }>tool.input.params;
    const result = mapSettings._bpm.toRealTime(
        beatmap.difficulty.getFirstInteractiveTime(mapSet._data)
    );

    if (result < time) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Hot start:</b> ${round(result, 2)}s`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
