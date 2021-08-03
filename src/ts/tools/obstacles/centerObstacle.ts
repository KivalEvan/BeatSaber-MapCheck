import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';
import { round } from '../../utils';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' 2-wide center obstascle';
htmlLabelCheck.htmlFor = 'input__tools-center-obstacle-check';
htmlInputCheck.id = 'input__tools-center-obstacle-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

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
            recovery: 0.25,
        },
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
    const { _obstacles: obstacles } = mapSet._data;
    const { _bpm: bpm } = mapSettings;
    const { recovery } = <{ recovery: number }>tool.input.params;
    const arr: beatmap.obstacle.Obstacle[] = [];
    let obstacleLFull: beatmap.obstacle.Obstacle = {
        _time: 0,
        _duration: 0,
        _lineIndex: 0,
        _type: 0,
        _width: 0,
    };
    let obstacleRFull: beatmap.obstacle.Obstacle = {
        _time: 0,
        _duration: 0,
        _lineIndex: 0,
        _type: 0,
        _width: 0,
    };
    obstacles.forEach((o) => {
        if (o._type === 0) {
            if (o._width > 2 || (o._width > 1 && o._lineIndex === 1)) {
                arr.push(o);
                if (beatmap.obstacle.isLonger(o, obstacleLFull)) {
                    obstacleLFull = o;
                }
                if (beatmap.obstacle.isLonger(o, obstacleRFull)) {
                    obstacleRFull = o;
                }
            } else if (o._width === 2) {
                if (o._lineIndex === 0) {
                    if (beatmap.obstacle.isLonger(o, obstacleLFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleRFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(obstacleRFull._time + obstacleRFull._duration) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLFull = o;
                    }
                } else if (o._lineIndex === 2) {
                    if (beatmap.obstacle.isLonger(o, obstacleRFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleLFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(obstacleLFull._time + obstacleLFull._duration) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleRFull = o;
                    }
                }
            } else if (o._width === 1) {
                if (o._lineIndex === 1) {
                    if (beatmap.obstacle.isLonger(o, obstacleLFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleRFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(obstacleRFull._time + obstacleRFull._duration) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleLFull = o;
                    }
                } else if (o._lineIndex === 2) {
                    if (beatmap.obstacle.isLonger(o, obstacleRFull)) {
                        if (
                            bpm.toRealTime(o._time) >
                                bpm.toRealTime(obstacleLFull._time) - recovery &&
                            bpm.toRealTime(o._time) <
                                bpm.toRealTime(obstacleLFull._time + obstacleLFull._duration) +
                                    recovery
                        ) {
                            arr.push(o);
                        }
                        obstacleRFull = o;
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

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Negative obstacle [${result.length}]:</b> ${result
            .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
