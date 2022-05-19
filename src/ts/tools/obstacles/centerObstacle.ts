import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

const defaultMaxTime = 0.25;
let localBPM!: beatmap.BeatPerMinute;

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
    run,
};

function adjustTimeHandler(bpm: beatmap.BeatPerMinute) {
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

function check(map: ToolArgs) {
    const { obstacles } = map.difficulty!.data;
    const { bpm } = map.settings;
    const { recovery } = <{ recovery: number }>tool.input.params;
    const arr: beatmap.v3.Obstacle[] = [];
    let obstacleLeftFull: beatmap.v3.Obstacle = beatmap.v3.Obstacle.create();
    let obstacleRightFull: beatmap.v3.Obstacle = beatmap.v3.Obstacle.create();
    obstacles.forEach((o) => {
        if (o.posY < 2 && o.height > 1) {
            if (o.width > 2) {
                arr.push(o);
                if (o.isLonger(obstacleLeftFull)) {
                    obstacleLeftFull = o;
                }
                if (o.isLonger(obstacleRightFull)) {
                    obstacleRightFull = o;
                }
            }
            if (o.width === 2) {
                if (o.posX === 0) {
                    if (o.isLonger(obstacleLeftFull)) {
                        if (
                            bpm.toRealTime(o.time) >
                                bpm.toRealTime(obstacleRightFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(
                                    obstacleRightFull.time + obstacleRightFull.duration
                                ) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLeftFull = o;
                    }
                }
                if (o.posX === 1) {
                    arr.push(o);
                    if (o.isLonger(obstacleLeftFull)) {
                        obstacleLeftFull = o;
                    }
                    if (o.isLonger(obstacleRightFull)) {
                        obstacleRightFull = o;
                    }
                }
                if (o.posX === 2) {
                    if (o.isLonger(obstacleRightFull)) {
                        if (
                            bpm.toRealTime(o.time) >
                                bpm.toRealTime(obstacleLeftFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(
                                    obstacleLeftFull.time + obstacleLeftFull.duration
                                ) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleRightFull = o;
                    }
                }
            }
            if (o.width === 1) {
                if (o.posX === 1) {
                    if (o.isLonger(obstacleLeftFull)) {
                        if (
                            bpm.toRealTime(o.time) >
                                bpm.toRealTime(obstacleRightFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(
                                    obstacleRightFull.time + obstacleRightFull.duration
                                ) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLeftFull = o;
                    }
                }
                if (o.posX === 2) {
                    if (o.isLonger(obstacleRightFull)) {
                        if (
                            bpm.toRealTime(o.time) >
                                bpm.toRealTime(obstacleLeftFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(
                                    obstacleLeftFull.time + obstacleLeftFull.duration
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
        .map((o) => o.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map);
    const { recovery } = <{ recovery: number }>tool.input.params;

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>2-wide center obstacle (<${round(
            recovery * 1000
        )}ms) [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
