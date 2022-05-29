import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { printResult } from '../helpers';

const name = 'Hot Start';
const description = 'Check for first interactive object starting at minimum 1.5s.';
const enabled = true;
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
    name,
    description,
    type: 'other',
    order: {
        input: ToolInputOrder.OTHERS_HOT_START,
        output: ToolOutputOrder.OTHERS_HOT_START,
    },
    input: {
        enabled,
        params: {
            time: defaultTime,
        },
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run,
};

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.time = round(Math.abs(parseFloat(this.value)), 3);
    this.value = tool.input.params.time.toString();
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const { time } = <{ time: number }>tool.input.params;
    const result = map.settings.bpm.toRealTime(map.difficulty.data.getFirstInteractiveTime());

    if (result < time) {
        tool.output.html = printResult('Hot start', `${round(result, 2)}s`);
    } else {
        tool.output.html = null;
    }
}

export default tool;
