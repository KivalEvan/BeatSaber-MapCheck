import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

const defaultSpeed = 0.025;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlInputMinTime = document.createElement('input');
const htmlLabelMinTime = document.createElement('label');
const htmlInputMinPrec = document.createElement('input');
const htmlLabelMinPrec = document.createElement('label');

let localBPM!: beatmap.BeatPerMinute;

htmlLabelCheck.textContent = ' Slow slider';
htmlLabelCheck.htmlFor = 'input__tools-slow-slider-check';
htmlInputCheck.id = 'input__tools-slow-slider-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

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

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);
htmlContainer.appendChild(document.createElement('br'));
htmlContainer.appendChild(htmlLabelMinTime);
htmlContainer.appendChild(htmlInputMinTime);
htmlContainer.appendChild(htmlLabelMinPrec);
htmlContainer.appendChild(htmlInputMinPrec);

const tool: Tool = {
    name: 'Slow Slider',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 21,
        output: 120,
    },
    input: {
        enabled: htmlInputCheck.checked,
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

function adjustTimeHandler(bpm: beatmap.BeatPerMinute) {
    localBPM = bpm;
    htmlInputMinPrec.value = round(1 / localBPM.toBeatTime(tool.input.params.minSpeed as number), 2).toString();
}

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.minSpeed = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.minSpeed * 1000, 1).toString();
    if (localBPM) {
        htmlInputMinPrec.value = round(1 / localBPM.toBeatTime(tool.input.params.minSpeed as number), 2).toString();
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
    const { minSpeed } = <{ minSpeed: number }>tool.input.params;

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
    const { minSpeed } = <{ minSpeed: number }>tool.input.params;
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Slow slider (>${round(minSpeed * 1000, 1)}ms) [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
