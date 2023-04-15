import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { printResultTime } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';
import { BeatPerMinute } from '../../beatmap/shared/bpm';

const name = 'Slow Slider';
const description = 'Look for slider that require slow swing.';
const enabled = true;
const defaultSpeed = 0.025;

const htmlContainer = document.createElement('div');
const htmlInputMinTime = document.createElement('input');
const htmlLabelMinTime = document.createElement('label');
const htmlInputMinPrec = document.createElement('input');
const htmlLabelMinPrec = document.createElement('label');

let localBPM!: BeatPerMinute;

htmlLabelMinTime.textContent = 'min speed (ms): ';
htmlLabelMinTime.htmlFor = 'input__tools-slow-slider-time';
htmlInputMinTime.id = 'input__tools-slow-slider-time';
htmlInputMinTime.className = 'input-toggle input--small';
htmlInputMinTime.type = 'number';
htmlInputMinTime.min = '0';
htmlInputMinTime.value = round(defaultSpeed * 1000, 1).toString();
htmlInputMinTime.addEventListener('change', inputTimeHandler);

htmlLabelMinPrec.textContent = ' (prec): ';
htmlLabelMinPrec.htmlFor = 'input__tools-slow-slider-prec';
htmlInputMinPrec.id = 'input__tools-slow-slider-prec';
htmlInputMinPrec.className = 'input-toggle input--small';
htmlInputMinPrec.type = 'number';
htmlInputMinPrec.min = '0';
htmlInputMinPrec.addEventListener('change', inputPrecHandler);

htmlContainer.appendChild(
    UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
        tool.input.enabled = this.checked;
    }),
);
htmlContainer.appendChild(htmlLabelMinTime);
htmlContainer.appendChild(htmlInputMinTime);
htmlContainer.appendChild(htmlLabelMinPrec);
htmlContainer.appendChild(htmlInputMinPrec);

const tool: Tool<{ minSpeed: number }> = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_SLOW_SLIDER,
        output: ToolOutputOrder.NOTES_SLOW_SLIDER,
    },
    input: {
        enabled,
        params: {
            minSpeed: defaultSpeed,
        },
        html: htmlContainer,
        adjustTime: adjustTimeHandler,
    },
    output: {
        html: null,
    },
    run,
};

function adjustTimeHandler(bpm: BeatPerMinute) {
    localBPM = bpm;
    htmlInputMinPrec.value = round(
        1 / localBPM.toBeatTime(tool.input.params.minSpeed),
        2,
    ).toString();
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.minSpeed = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.minSpeed * 1000, 1).toString();
    if (localBPM) {
        htmlInputMinPrec.value = round(
            1 / localBPM.toBeatTime(tool.input.params.minSpeed),
            2,
        ).toString();
    }
}

function inputPrecHandler(this: HTMLInputElement) {
    if (!localBPM) {
        this.value = '0';
        return;
    }
    let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
    tool.input.params.minSpeed = localBPM.toRealTime(1 / val);
    htmlInputMinTime.value = round(tool.input.params.minSpeed * 1000, 1).toString();
    this.value = val.toString();
}

function check(map: ToolArgs) {
    const { swingAnalysis } = map.difficulty!;
    const { minSpeed } = tool.input.params;

    return swingAnalysis.container
        .filter((s) => s.maxSpeed > minSpeed || s.minSpeed > minSpeed)
        .map((n) => n.time)
        .filter((x, i, ary) => {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const { minSpeed } = tool.input.params;
    const result = check(map);

    if (result.length) {
        tool.output.html = printResultTime(
            `Slow slider (>${round(minSpeed * 1000, 1)}ms)`,
            result,
            map.settings.bpm,
            'warning',
        );
    } else {
        tool.output.html = null;
    }
}

export default tool;
