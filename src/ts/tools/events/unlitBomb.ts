import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import { EnvironmentName } from '../../types/beatmap/shared/environment';
import UICheckbox from '../../ui/checkbox';

const name = ' Unlit Nomb';

const tool: Tool = {
    name: 'Unlit Bomb',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 3,
        output: 203,
    },
    input: {
        enabled: true,
        params: {},
        html: UICheckbox.create(name, name, true, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

// omega scuffed clusterfuck help me pls im cryin rn
const unlitBomb = (
    bombs: beatmap.v3.BombNote[],
    events: beatmap.v3.BasicEvent[],
    bpm: beatmap.BeatPerMinute,
    environment: EnvironmentName
) => {
    if (!events.length) {
        return [];
    }
    const arr: beatmap.v3.BombNote[] = [];
    const eventsLight = events
        .filter(
            (ev) =>
                ev.isLightEvent() && beatmap.EventList[environment][0].includes(ev.type)
        )
        .sort((a, b) => a.type - b.type) as beatmap.v3.BasicEvent[];
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
    } = {};
    beatmap.EventList[environment][0].forEach((e) => (eventLitTime[e] = [[0, false]]));
    const fadeTime = bpm.toBeatTime(1);
    const reactTime = bpm.toBeatTime(0.25);
    for (let i = 0, len = eventsLight.length; i < len; i++) {
        const ev = eventsLight[i];
        if ((ev.isOn() || ev.isFlash()) && eventState[ev.type].state !== 'on') {
            eventState[ev.type] = {
                state: 'on',
                time: ev.time,
                fadeTime: 0,
            };
            const elt = eventLitTime[ev.type].find((e) => e[0] >= ev.time);
            if (elt) {
                elt[0] = ev.time;
                elt[1] = true;
            } else {
                eventLitTime[ev.type].push([ev.time, true]);
            }
        }
        if (ev.isFade()) {
            eventState[ev.type] = {
                state: 'off',
                time: ev.time,
                fadeTime: fadeTime,
            };
            const elt = eventLitTime[ev.type].find((e) => e[0] >= ev.time);
            if (elt) {
                elt[0] = ev.time;
                elt[1] = true;
            } else {
                eventLitTime[ev.type].push([ev.time, true]);
            }
            eventLitTime[ev.type].push([ev.time + fadeTime, false]);
        }
        if (
            ((ev?.floatValue ?? 1) < 0.25 ||
                ev.isOff() ||
                (ev.customData?._color &&
                    ((typeof ev.customData._color[3] === 'number' &&
                        ev.customData._color[3] < 0.25) ||
                        Math.max(
                            ev.customData._color[0],
                            ev.customData._color[1],
                            ev.customData._color[2]
                        ) < 0.25))) &&
            eventState[ev.type].state !== 'off'
        ) {
            eventState[ev.type] = {
                state: 'off',
                time: ev.time,
                fadeTime:
                    eventState[ev.type].state === 'on'
                        ? reactTime
                        : Math.min(reactTime, eventState[ev.type].fadeTime),
            };
            eventLitTime[ev.type].push([
                ev.time +
                    (eventState[ev.type].state === 'on'
                        ? reactTime
                        : Math.min(reactTime, eventState[ev.type].fadeTime)),
                false,
            ]);
        }
    }
    for (const el in eventLitTime) {
        eventLitTime[el].reverse();
    }
    for (let i = 0, len = bombs.length, isLit = false; i < len; i++) {
        const note = bombs[i];
        isLit = false;
        // find lit event by time
        for (const el in eventLitTime) {
            const t = eventLitTime[el].find((e) => e[0] <= note.time);
            if (t) {
                isLit = isLit || t[1];
            }
        }
        if (!isLit) {
            arr.push(note);
        }
    }
    return arr
        .map((n) => n.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
};

function run(map: ToolArgs) {
    const result = unlitBomb(
        map.difficulty.data.bombNotes,
        map.difficulty.data.basicBeatmapEvents,
        map.settings.bpm,
        map.info._environmentName
    );

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Unlit bomb [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
