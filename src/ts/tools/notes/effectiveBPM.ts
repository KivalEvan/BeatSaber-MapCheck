import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const defaultEBPM = 450;
const defaultEBPMS = 350;

const htmlContainer = document.createElement('div');
const htmlInputEBPM = document.createElement('input');
const htmlLabelEBPM = document.createElement('label');
const htmlInputEBPMS = document.createElement('input');
const htmlLabelEBPMS = document.createElement('label');

htmlLabelEBPM.textContent = 'Effective BPM threshold: ';
htmlLabelEBPM.htmlFor = 'input__tools-ebpm';
htmlInputEBPM.id = 'input__tools-ebpm';
htmlInputEBPM.className = 'input-toggle input--small';
htmlInputEBPM.type = 'number';
htmlInputEBPM.min = '0';
htmlInputEBPM.value = defaultEBPM.toString();
htmlInputEBPM.addEventListener('change', inputEBPMHandler);

htmlLabelEBPMS.textContent = ' (swing): ';
htmlLabelEBPMS.htmlFor = 'input__tools-ebpms';
htmlInputEBPMS.id = 'input__tools-ebpms';
htmlInputEBPMS.className = 'input-toggle input--small';
htmlInputEBPMS.type = 'number';
htmlInputEBPMS.min = '0';
htmlInputEBPMS.value = defaultEBPMS.toString();
htmlInputEBPMS.addEventListener('change', inputEBPMSHandler);

htmlContainer.appendChild(htmlLabelEBPM);
htmlContainer.appendChild(htmlInputEBPM);
htmlContainer.appendChild(htmlLabelEBPMS);
htmlContainer.appendChild(htmlInputEBPMS);

const tool: Tool = {
    name: 'Effective BPM',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        option: {
            enabled: false,
            ebpmThres: defaultEBPM,
            ebpmsThres: defaultEBPMS,
        },
        html: htmlContainer,
    },
    output: {
        result: null,
        html: null,
        console() {
            return this.result;
        },
    },
    run: check,
};

function inputEBPMHandler(this: HTMLInputElement) {
    tool.input.option.ebpmThres = round(Math.abs(parseFloat(this.value)), 1);
    this.value = tool.input.option.ebpmThres.toString();
}

function inputEBPMSHandler(this: HTMLInputElement) {
    tool.input.option.ebpmsThres = round(Math.abs(parseFloat(this.value)), 1);
    this.value = tool.input.option.ebpmsThres.toString();
}

function check(mapSettings: BeatmapSettings, mapData: beatmap.map.BeatmapSetData): void {
    tool.output.result;
    return;
}

export default tool;
