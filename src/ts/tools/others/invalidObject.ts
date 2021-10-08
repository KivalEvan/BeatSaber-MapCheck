import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';
import { round } from '../../utils';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Invalid object';
htmlLabelCheck.htmlFor = 'input__tools-invalid-object-check';
htmlInputCheck.id = 'input__tools-invalid-object-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Invalid Object',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 20,
        output: 20,
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
    const { _notes: notes } = mapSet._data;
    return notes
        .filter((n) => beatmap.note.hasMappingExtensions(n))
        .map((n) => n._time);
}

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes, _obstacles: obstacles, _events: events } = mapSet._data;

    let noteResult: number[] = [];
    let obstacleResult: number[] = [];
    if (!mapSet._info._customData?._requirements?.includes('Mapping Extensions')) {
        if (mapSet._info._customData?._requirements?.includes('Noodle Extensions')) {
            noteResult = notes
                .filter(
                    (n) =>
                        beatmap.note.hasMappingExtensions(n) &&
                        !beatmap.note.hasNoodleExtensions(n)
                )
                .map((n) => n._time);
            obstacleResult = obstacles
                .filter(
                    (o) =>
                        beatmap.obstacle.hasMappingExtensions(o) &&
                        !beatmap.obstacle.hasNoodleExtensions(o)
                )
                .map((o) => o._time);
        } else {
            noteResult = notes
                .filter((n) => !beatmap.note.isValid(n))
                .map((n) => n._time);
            obstacleResult = obstacles
                .filter((o) => !beatmap.obstacle.isValid(o))
                .map((o) => o._time);
        }
    }
    const eventResult = events
        .filter((e) => !beatmap.event.isValid(e))
        .map((e) => e._time);

    const htmlString: string[] = [];
    if (noteResult.length) {
        htmlString.push(
            `<b>Invalid note [${noteResult.length}]:</b> ${noteResult
                .map((n) => round(bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (obstacleResult.length) {
        htmlString.push(
            `<b>Invalid obstacle [${obstacleResult.length}]:</b> ${obstacleResult
                .map((n) => round(bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (eventResult.length) {
        htmlString.push(
            `<b>Invalid event [${eventResult.length}]:</b> ${eventResult
                .map((n) => round(bpm.adjustTime(n), 3))
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
