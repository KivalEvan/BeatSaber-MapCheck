import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { printResultTime } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { PositionX, PositionY } from '../../beatmap/shared/constants';
import { Obstacle } from '../../beatmap/v3/obstacle';

const name = '2-wide Center Obstacle';
const description = 'Look for 2-wide center obstacle including obstacles that are relatively close to each other.';
const enabled = true;
const defaultMaxTime = 0.25;
let localBPM!: BeatPerMinute;

const htmlContainer = document.createElement('div');
const htmlInputMaxTime = document.createElement('input');
const htmlLabelMaxTime = document.createElement('label');
const htmlInputMaxBeat = document.createElement('input');
const htmlLabelMaxBeat = document.createElement('label');

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

htmlContainer.appendChild(
    UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
        tool.input.enabled = this.checked;
    }),
);
htmlContainer.appendChild(htmlLabelMaxTime);
htmlContainer.appendChild(htmlInputMaxTime);
htmlContainer.appendChild(htmlLabelMaxBeat);
htmlContainer.appendChild(htmlInputMaxBeat);

const tool: Tool<{ recovery: number }> = {
    name,
    description,
    type: 'obstacle',
    order: {
        input: ToolInputOrder.OBSTACLES_CENTER,
        output: ToolOutputOrder.OBSTACLES_CENTER,
    },
    input: {
        enabled,
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

function adjustTimeHandler(bpm: BeatPerMinute) {
    localBPM = bpm;
    htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.recovery), 2).toString();
}

function inputTimeHandler(this: HTMLInputElement) {
    tool.input.params.recovery = Math.abs(parseFloat(this.value)) / 1000;
    this.value = round(tool.input.params.recovery * 1000, 1).toString();
    if (localBPM) {
        htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.recovery), 2).toString();
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
    const { recovery } = tool.input.params;
    const arr: Obstacle[] = [];
    let obstacleLeftFull: Obstacle = Obstacle.create()[0];
    let obstacleRightFull: Obstacle = Obstacle.create()[0];
    obstacles.forEach((o) => {
        if (o.posY < PositionY.TOP && o.height > 1) {
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
                if (o.posX === PositionX.LEFT) {
                    if (o.isLonger(obstacleLeftFull)) {
                        if (
                            bpm.toRealTime(o.time) > bpm.toRealTime(obstacleRightFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(obstacleRightFull.time + obstacleRightFull.duration) + recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLeftFull = o;
                    }
                }
                if (o.posX === PositionX.MIDDLE_LEFT) {
                    arr.push(o);
                    if (o.isLonger(obstacleLeftFull)) {
                        obstacleLeftFull = o;
                    }
                    if (o.isLonger(obstacleRightFull)) {
                        obstacleRightFull = o;
                    }
                }
                if (o.posX === PositionX.MIDDLE_RIGHT) {
                    if (o.isLonger(obstacleRightFull)) {
                        if (
                            bpm.toRealTime(o.time) > bpm.toRealTime(obstacleLeftFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(obstacleLeftFull.time + obstacleLeftFull.duration) + recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleRightFull = o;
                    }
                }
            }
            if (o.width === 1) {
                if (o.posX === PositionX.MIDDLE_LEFT) {
                    if (o.isLonger(obstacleLeftFull)) {
                        if (
                            bpm.toRealTime(o.time) > bpm.toRealTime(obstacleRightFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(obstacleRightFull.time + obstacleRightFull.duration) + recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLeftFull = o;
                    }
                }
                if (o.posX === PositionX.MIDDLE_RIGHT) {
                    if (o.isLonger(obstacleRightFull)) {
                        if (
                            bpm.toRealTime(o.time) > bpm.toRealTime(obstacleLeftFull.time) - recovery &&
                            bpm.toRealTime(o.time) <
                                bpm.toRealTime(obstacleLeftFull.time + obstacleLeftFull.duration) + recovery
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
    const { recovery } = tool.input.params;

    if (result.length) {
        tool.output.html = printResultTime(
            `2-wide center obstacle (<${round(recovery * 1000)}ms)`,
            result,
            map.settings.bpm,
            'error',
        );
    } else {
        tool.output.html = null;
    }
}

export default tool;
