import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Old value 4 event';
htmlLabelCheck.htmlFor = 'input__tools-light-4';
htmlInputCheck.id = 'input__tools-light-4';
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
        input: 1,
        output: 1,
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

function check(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _events: events } = mapSet._data;

    const arr: beatmap.event.Event[] = [];
    if (beatmap.version.compare(mapSet._data._version, 'difficulty') === 'old') {
        for (let i = events.length - 1; i >= 0; i--) {
            if (beatmap.event.isLightEvent(events[i]) && events[i]._value === 4) {
                arr.push(events[i]);
            }
        }
    } else {
        return [];
    }
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Event with value 4 [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
