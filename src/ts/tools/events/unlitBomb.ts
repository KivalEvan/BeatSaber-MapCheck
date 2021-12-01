import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Unlit bomb';
htmlLabelCheck.htmlFor = 'input__tools-unlit-bomb';
htmlInputCheck.id = 'input__tools-unlit-bomb';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Unlit Bomb',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 3,
        output: 203,
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

// omega scuffed clusterfuck help me pls im cryin rn
const unlitBomb = (
    notes: beatmap.note.Note[],
    events: beatmap.event.Event[],
    bpm: beatmap.bpm.BeatPerMinute
) => {
    if (!events.length) {
        return [];
    }
    const arr: beatmap.note.Note[] = [];
    const eventsLight = events
        .filter((ev) => beatmap.event.isLightEvent(ev))
        .sort((a, b) => a._type - b._type);
    const eventState: {
        [key: number]: {
            state: 'off' | 'fading' | 'on';
            time: number;
            fadeTime: number;
        };
    } = {
        0: { state: 'off', time: 0, fadeTime: 0 },
        1: { state: 'off', time: 0, fadeTime: 0 },
        2: { state: 'off', time: 0, fadeTime: 0 },
        3: { state: 'off', time: 0, fadeTime: 0 },
        4: { state: 'off', time: 0, fadeTime: 0 },
        6: { state: 'off', time: 0, fadeTime: 0 },
        7: { state: 'off', time: 0, fadeTime: 0 },
        10: { state: 'off', time: 0, fadeTime: 0 },
        11: { state: 'off', time: 0, fadeTime: 0 },
    };
    const eventLitTime: {
        [key: number]: [number, boolean][];
    } = {
        0: [[0, false]],
        1: [[0, false]],
        2: [[0, false]],
        3: [[0, false]],
        4: [[0, false]],
        6: [[0, false]],
        7: [[0, false]],
        10: [[0, false]],
        11: [[0, false]],
    };
    const fadeTime = bpm.toBeatTime(1);
    const reactTime = bpm.toBeatTime(0.25);
    for (let i = 0, len = eventsLight.length; i < len; i++) {
        const ev = eventsLight[i];
        if (
            (beatmap.event.isOn(ev) || beatmap.event.isFlash(ev)) &&
            eventState[ev._type].state !== 'on'
        ) {
            eventState[ev._type] = {
                state: 'on',
                time: ev._time,
                fadeTime: 0,
            };
            let e = eventLitTime[ev._type].find((e) => e[0] >= ev._time && !ev[1]);
            if (e) {
                e[0] = ev._time;
                e[1] = true;
            } else {
                eventLitTime[ev._type].push([ev._time, true]);
            }
        }
        if (beatmap.event.isFade(ev)) {
            eventState[ev._type] = {
                state: 'off',
                time: ev._time,
                fadeTime: fadeTime,
            };
            let e = eventLitTime[ev._type].find((e) => e[0] >= ev._time && !ev[1]);
            if (e) {
                e[0] = ev._time;
                e[1] = true;
            } else {
                eventLitTime[ev._type].push([ev._time, true]);
            }
            eventLitTime[ev._type].push([ev._time + fadeTime, false]);
        }
        if (
            ((ev?._floatValue ?? 1) < 0.25 || beatmap.event.isOff(ev)) &&
            eventState[ev._type].state !== 'off'
        ) {
            eventState[ev._type] = {
                state: 'off',
                time: ev._time,
                fadeTime:
                    eventState[ev._type].state === 'on'
                        ? reactTime
                        : Math.min(reactTime, eventState[ev._type].fadeTime),
            };
            eventLitTime[ev._type].push([
                ev._time +
                    (eventState[ev._type].state === 'on'
                        ? reactTime
                        : Math.min(reactTime, eventState[ev._type].fadeTime)),
                false,
            ]);
        }
    }
    for (const el in eventLitTime) {
        eventLitTime[el].reverse();
    }
    for (let i = 0, len = notes.length, isLit = false; i < len; i++) {
        const note = notes[i];
        if (!beatmap.note.isBomb(note)) {
            continue;
        }
        isLit = false;
        // find lit event by time
        for (const el in eventLitTime) {
            const t = eventLitTime[el].find((e) => e[0] <= note._time);
            if (t) {
                isLit = isLit || t[1];
            }
        }
        if (!isLit) {
            arr.push(note);
        }
    }
    return arr
        .map((n) => n._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
};

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = unlitBomb(
        mapSet._data._notes,
        mapSet._data._events,
        mapSettings._bpm
    );

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Unlit bomb [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;