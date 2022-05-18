import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/checkbox';

const name = ' <15ms Obstacle';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'obstacle',
    order: {
        input: 0,
        output: 50,
    },
    input: {
        enabled: true,
        params: {
            minDur: 0.015,
        },
        html: UICheckbox.create(name, name, true, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

function check(map: ToolArgs) {
    const { obstacles } = map.difficulty.data;
    const { bpm } = map.settings;
    const { minDur: temp } = <{ minDur: number }>tool.input.params;
    const minDur = bpm.toBeatTime(temp);
    const arr: beatmap.v3.Obstacle[] = [];
    let obstacleLFull: beatmap.v3.Obstacle = beatmap.v3.Obstacle.create();
    let obstacleRFull: beatmap.v3.Obstacle = beatmap.v3.Obstacle.create();
    let obstacleLHalf: beatmap.v3.Obstacle = beatmap.v3.Obstacle.create();
    let obstacleRHalf: beatmap.v3.Obstacle = beatmap.v3.Obstacle.create();
    obstacles.forEach((o) => {
        if (o.posY === 0 && o.height > 2 && o.duration > 0) {
            if (o.width > 2 || (o.width > 1 && o.posX === 1)) {
                if (o.isLonger(obstacleLFull)) {
                    if (o.duration < minDur) {
                        arr.push(o);
                    }
                    obstacleLFull = o;
                }
                if (o.isLonger(obstacleRFull)) {
                    if (o.duration < minDur) {
                        arr.push(o);
                    }
                    obstacleRFull = o;
                }
            } else if (o.width === 2) {
                if (o.posX === 0) {
                    if (o.isLonger(obstacleLFull)) {
                        if (o.duration < minDur) {
                            arr.push(o);
                        }
                        obstacleLFull = o;
                    }
                } else if (o.posX === 2) {
                    if (o.isLonger(obstacleRFull)) {
                        if (o.duration < minDur) {
                            arr.push(o);
                        }
                        obstacleRFull = o;
                    }
                }
            } else if (o.width === 1) {
                if (o.posX === 1) {
                    if (o.isLonger(obstacleLFull)) {
                        if (o.duration < minDur) {
                            arr.push(o);
                        }
                        obstacleLFull = o;
                    }
                } else if (o.posX === 2) {
                    if (o.isLonger(obstacleRFull)) {
                        if (o.duration < minDur) {
                            arr.push(o);
                        }
                        obstacleRFull = o;
                    }
                }
            }
        } else if (o.posY === 2 && o.height > 2 && o.duration > 0) {
            if (o.width > 2 || (o.width > 1 && o.posX === 1)) {
                if (o.isLonger(obstacleLHalf)) {
                    if (
                        o.duration < minDur &&
                        o.isLonger(obstacleLFull, minDur) &&
                        o.isLonger(obstacleLHalf, minDur)
                    ) {
                        arr.push(o);
                    }
                    obstacleLHalf = o;
                }
                if (o.isLonger(obstacleRHalf)) {
                    if (
                        o.duration < minDur &&
                        o.isLonger(obstacleRFull, minDur) &&
                        o.isLonger(obstacleRHalf, minDur)
                    ) {
                        arr.push(o);
                    }
                    obstacleRHalf = o;
                }
            } else if (o.width === 2) {
                if (o.posX === 0) {
                    if (o.isLonger(obstacleLHalf)) {
                        if (
                            o.duration < minDur &&
                            o.isLonger(obstacleLFull, minDur) &&
                            o.isLonger(obstacleLHalf, minDur)
                        ) {
                            arr.push(o);
                        }
                        obstacleLHalf = o;
                    }
                } else if (o.posX === 2) {
                    if (o.isLonger(obstacleRHalf)) {
                        if (
                            o.duration < minDur &&
                            o.isLonger(obstacleRFull, minDur) &&
                            o.isLonger(obstacleRHalf, minDur)
                        ) {
                            arr.push(o);
                        }
                        obstacleRHalf = o;
                    }
                }
            } else if (o.width === 1) {
                if (o.posX === 1) {
                    if (o.isLonger(obstacleLHalf)) {
                        if (
                            o.duration < minDur &&
                            o.isLonger(obstacleLFull, minDur) &&
                            o.isLonger(obstacleLHalf, minDur)
                        ) {
                            arr.push(o);
                        }
                        obstacleLHalf = o;
                    }
                } else if (o.posX === 2) {
                    if (o.isLonger(obstacleRHalf)) {
                        if (
                            o.duration < minDur &&
                            o.isLonger(obstacleRFull, minDur) &&
                            o.isLonger(obstacleRHalf, minDur)
                        ) {
                            arr.push(o);
                        }
                        obstacleRHalf = o;
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
    const result = check(map);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b><15ms obstacle [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
