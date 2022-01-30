import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Event peak (1 second) and per second';
htmlLabelCheck.htmlFor = 'input__tools-light-stats';
htmlInputCheck.id = 'input__tools-light-stats';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = false;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Insufficient Light',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 2,
        output: 2,
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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.types.set.BeatmapSetData) {
    const { _bpm: bpm, _audioDuration: duration } = mapSettings;
    const { _events: events } = mapSet._data;

    let second = bpm.toBeatTime(1);
    let peakEPS = 0;
    let currentSectionStart = 0;
    for (let i = 0; i < events.length; i++) {
        while (events[i]._time - events[currentSectionStart]._time > second) {
            currentSectionStart++;
        }
        peakEPS = Math.max(
            peakEPS,
            (i - currentSectionStart + second) / ((1 / bpm.value) * 60)
        );
    }
    return {
        EPS: duration ? round(events.length / duration, 3) : 0,
        peakEPS: round(peakEPS, 3),
    };
}

function run(
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.set.BeatmapSetData
): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Events per second:</b> ${result.EPS}<br><b>Peak Event (1s):</b> ${result.peakEPS}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
