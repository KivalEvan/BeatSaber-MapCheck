import * as beatmap from '../../beatmap';
import { round, toMMSS } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Outside playable object';
htmlLabelCheck.htmlFor = 'input__tools-outside-object-check';
htmlInputCheck.id = 'input__tools-outside-object-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Difficulty Label',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 0,
        output: 0,
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

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const { _bpm: bpm, _audioDuration: duration } = mapSettings;
    const { _notes: notes, _obstacles: obstacles, _events: events } = mapSet._data;

    const htmlString: string[] = [];
    if (duration) {
        let endBeat = bpm.toBeatTime(duration);
        if (notes[0]._time < 0) {
            htmlString.push(
                `<b>Note(s) before start time:</b> ${round(notes[0]._time, 3)} (${toMMSS(
                    bpm.toRealTime(notes[0]._time)
                )})`
            );
        }
        if (obstacles[0]._time < 0) {
            htmlString.push(
                `<b>Obstacle(s) before start time:</b> ${round(obstacles[0]._time, 3)} (${toMMSS(
                    bpm.toRealTime(obstacles[0]._time)
                )})`
            );
        }
        if (events[0]._time < 0) {
            htmlString.push(
                `<b>Event(s) before start time:</b> ${round(events[0]._time, 3)} (${toMMSS(
                    bpm.toRealTime(events[0]._time)
                )})`
            );
        }
        if (notes[notes.length - 1]._time > endBeat) {
            htmlString.push(
                `<b>Note(s) after end time:</b> ${round(
                    notes[notes.length - 1]._time,
                    3
                )} (${toMMSS(bpm.toRealTime(notes[notes.length - 1]._time))})`
            );
        }
        if (obstacles[obstacles.length - 1]._time > endBeat) {
            htmlString.push(
                `<b>Obstacle(s) after end time:</b> ${round(
                    obstacles[obstacles.length - 1]._time,
                    3
                )} (${toMMSS(bpm.toRealTime(obstacles[obstacles.length - 1]._time))})`
            );
        }
        if (events[events.length - 1]._time > endBeat) {
            htmlString.push(
                `<b>Event(s) after end time:</b> ${round(
                    events[events.length - 1]._time,
                    3
                )} (${toMMSS(bpm.toRealTime(events[events.length - 1]._time))})`
            );
        }
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
