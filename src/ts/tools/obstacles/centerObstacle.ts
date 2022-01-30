import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';
import { round } from '../../utils';

const defaultMaxTime = 0.25;
let localBPM!: beatmap.bpm.BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlInputMaxTime = document.createElement('input');
const htmlLabelMaxTime = document.createElement('label');
const htmlInputMaxBeat = document.createElement('input');
const htmlLabelMaxBeat = document.createElement('label');

htmlLabelCheck.textContent = ' 2-wide center obstacle';
htmlLabelCheck.htmlFor = 'input__tools-center-obstacle-check';
htmlInputCheck.id = 'input__tools-center-obstacle-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlLabelMaxTime.textContent = 'recovery time (ms): ';
htmlLabelMaxTime.htmlFor = 'input__tools-2wide-wall-time';
htmlInputMaxTime.id = 'input__tools-2wide-wall-time';
htmlInputMaxTime.className = 'input-toggle input--small';
htmlInputMaxTime.type = 'number';
htmlInputMaxTime.min = '0';
htmlInputMaxTime.value = round(defaultMaxTime * 1000, 1).toString();
htmlInputMaxTime.addEventListener('change', inputTimeHandler);

htmlLabelMaxBeat.textContent = ' (beat): ';
htmlLabelMaxBeat.htmlFor = 'input__tools-2wide-wall-beat';
htmlInputMaxBeat.id = 'input__tools-2wide-wall-beat';
htmlInputMaxBeat.className = 'input-toggle input--small';
htmlInputMaxBeat.type = 'number';
htmlInputMaxBeat.min = '0';
htmlInputMaxBeat.step = '0.1';
htmlInputMaxBeat.addEventListener('change', inputBeatHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);
htmlContainer.appendChild(document.createElement('br'));
htmlContainer.appendChild(htmlLabelMaxTime);
htmlContainer.appendChild(htmlInputMaxTime);
htmlContainer.appendChild(htmlLabelMaxBeat);
htmlContainer.appendChild(htmlInputMaxBeat);

const tool: Tool = {
    name: '2-wide Center Obstacle',
    description: 'Placeholder',
    type: 'obstacle',
    order: {
        input: 10,
        output: 60,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {
            recovery: defaultMaxTime,
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
    localBPM = bpm;
    htmlInputMaxBeat.value = round(
        localBPM.toBeatTime(tool.input.params.recovery as number),
        2
    ).toString();
}

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.recovery = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.recovery * 1000, 1).toString();
    if (localBPM) {
        htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.recovery as number),
            2
        ).toString();
    }
}

function inputBeatHandler(this: HTMLInputElement) {
    if (!localBPM) {
        this.value = '0';
        return;
    }
    let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
    tool.input.params.recovery = localBPM.toRealTime(val);
    htmlInputMaxTime.value = round(tool.input.params.recovery * 1000, 1).toString();
    this.value = val.toString();
}

function check(mapSettings: BeatmapSettings, mapSet: beatmap.types.set.BeatmapSetData) {
    const { _obstacles: obstacles } = mapSet._data;
    const { _bpm: bpm } = mapSettings;
    const { recovery } = <{ recovery: number }>tool.input.params;
    const arr: beatmap.types.obstacle.Obstacle[] = [];
    let obstacleLeftFull: beatmap.types.obstacle.Obstacle = {
        _time: 0,
        _duration: 0,
        _lineIndex: 0,
        _type: 0,
        _width: 0,
    };
    let obstacleRightFull: beatmap.types.obstacle.Obstacle = {
        _time: 0,
        _duration: 0,
        _lineIndex: 0,
        _type: 0,
        _width: 0,
    };
    obstacles.forEach((o) => {
        if (o._type === 0) {
            if (o._width > 2) {
                arr.push(o);
                if (beatmap.obstacle.isLonger(o, obstacleLeftFull)) {
                    obstacleLeftFull = o;
                }
                if (beatmap.obstacle.isLonger(o, obstacleRightFull)) {
                    obstacleRightFull = o;
                }
            }
            if (o._width === 2) {
                if (o._lineIndex === 0) {
                    if (beatmap.obstacle.isLonger(o, obstacleLeftFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleRightFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(
                                    obstacleRightFull._time +
                                        obstacleRightFull._duration
                                ) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLeftFull = o;
                    }
                }
                if (o._lineIndex === 1) {
                    arr.push(o);
                    if (beatmap.obstacle.isLonger(o, obstacleLeftFull)) {
                        obstacleLeftFull = o;
                    }
                    if (beatmap.obstacle.isLonger(o, obstacleRightFull)) {
                        obstacleRightFull = o;
                    }
                }
                if (o._lineIndex === 2) {
                    if (beatmap.obstacle.isLonger(o, obstacleRightFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleLeftFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(
                                    obstacleLeftFull._time + obstacleLeftFull._duration
                                ) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleRightFull = o;
                    }
                }
            }
            if (o._width === 1) {
                if (o._lineIndex === 1) {
                    if (beatmap.obstacle.isLonger(o, obstacleLeftFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleRightFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(
                                    obstacleRightFull._time +
                                        obstacleRightFull._duration
                                ) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLeftFull = o;
                    }
                }
                if (o._lineIndex === 2) {
                    if (beatmap.obstacle.isLonger(o, obstacleRightFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleLeftFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(
                                    obstacleLeftFull._time + obstacleLeftFull._duration
                                ) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleRightFull = o;
                    }
                }
            }
        }
    });
    return arr
        .map((o) => o._time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.set.BeatmapSetData
): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);
    const { recovery } = <{ recovery: number }>tool.input.params;

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>2-wide center obstacle (<${round(
            recovery * 1000
        )}ms) [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
