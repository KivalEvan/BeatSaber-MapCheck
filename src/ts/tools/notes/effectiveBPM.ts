import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';

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
        enabled: true,
        params: {
            ebpmThres: defaultEBPM,
            ebpmsThres: defaultEBPMS,
        },
        html: htmlContainer,
        adjustTime: adjustTimeHandler,
    },
    output: {
        html: null,
    },
    run: run,
};

function adjustTimeHandler(bpm: beatmap.bpm.BeatPerMinute) {
    tool.input.params.ebpmThres = round(Math.min(defaultEBPM, bpm.value * 2 * 1.285714), 1);
    tool.input.params.ebpmsThres = round(Math.min(defaultEBPMS, bpm.value * 2), 1);
    htmlInputEBPM.value = tool.input.params.ebpmThres.toString();
    htmlInputEBPMS.value = tool.input.params.ebpmsThres.toString();
}

function inputEBPMHandler(this: HTMLInputElement) {
    tool.input.params.ebpmThres = round(Math.abs(parseFloat(this.value)), 1);
    this.value = tool.input.params.ebpmThres.toString();
}

function inputEBPMSHandler(this: HTMLInputElement) {
    tool.input.params.ebpmsThres = round(Math.abs(parseFloat(this.value)), 1);
    this.value = tool.input.params.ebpmsThres.toString();
}

function check(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;
    const { ebpmThres, ebpmsThres } = <{ ebpmThres: number; ebpmsThres: number }>tool.input.params;

    const noteEBPM = swing
        .getEffectiveBPMNote(notes, bpm)
        .filter((n) => n._ebpm > ebpmThres)
        .map((n) => n._time);
    const noteEBPMS = swing
        .getEffectiveBPMSwingNote(notes, bpm)
        .filter((n) => n._ebpm > ebpmsThres)
        .map((n) => n._time);

    return { base: noteEBPM, swing: noteEBPMS };
}

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);
    const { ebpmThres, ebpmsThres } = <{ ebpmThres: number; ebpmsThres: number }>tool.input.params;

    const htmlString: string[] = [];
    if (result.base.length) {
        htmlString.push(
            `<b>>${ebpmThres}EBPM warning [${result.base.length}]:</b> ${result.base
                .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (result.swing.length) {
        htmlString.push(
            `<b>>${ebpmsThres}EBPM (swing) warning [${result.swing.length}]:</b> ${result.swing
                .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }

    if (htmlString.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = htmlString.join('<br>');
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
