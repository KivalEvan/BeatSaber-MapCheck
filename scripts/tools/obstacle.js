 /* OBSTACLE SCRIPT - obstacle.js
    it's nothing, planned to expand further for obstacle related
    TODO: crouch obstacle detection */

function countInteractiveObstacle(obstacles) {
    let count = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width > 1 || obstacles[i]._lineIndex === 1 || obstacles[i]._lineIndex === 2)
            count++;
    return count;
}

function countChromaObstacle(obstacles) {
    let count = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._customData?._color)
            count++;
    return count;
}

function detectZeroObstacle(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (obstacles[i]._width === 0 || (toRealTime(obstacles[i]._duration) < 0.001 && !obstacles[i]._duration < 0)) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

function detectInvalidObstacle(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (obstacles[i]._width > 4 || obstacles[i]._lineIndex > 3 || obstacles[i]._lineIndex < 0 || obstacles[i]._type > 1 || obstacles[i]._type < 0) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        } else if (obstacles[i]._width === 4 && obstacles[i]._lineIndex > 0) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        } else if (obstacles[i]._width === 3 && obstacles[i]._lineIndex > 1) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        } else if (obstacles[i]._width === 2 && obstacles[i]._lineIndex > 2) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

function detectNegativeObstacle(obstacles, bpm, offset, bpmc) {
    let arr = [];
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (obstacles[i]._width < 0 || obstacles[i]._duration < 0) {
            arr.push(adjustTime(obstacles._time, bpm, offset, bpmc));
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

// god this was more complicated than i thought, but i dont think it should
function detectCenterObstacle(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let obstacleLFull = { _time: 0, _duration: 0 };
    let obstacleRFull = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type === 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                if (obstacleLonger(obstacle, obstacleLFull)) {
                    obstacleLFull = obstacle;
                }
                if (obstacleLonger(obstacle, obstacleRFull)) {
                    obstacleRFull = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (obstacleLonger(obstacle, obstacleLFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(obstacleRFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(obstacleRFull._time + obstacleRFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(obstacleLFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(obstacleLFull._time + obstacleLFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (obstacleLonger(obstacle, obstacleLFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(obstacleRFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(obstacleRFull._time + obstacleRFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(obstacleLFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(obstacleLFull._time + obstacleLFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleRFull = obstacle;
                    }
                }
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

// overly complicated stuff again
// jfc i need to put these repetition in function or somethin
// ok maybe i need to simplify it somehow
// pain
function detectShortObstacle(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let obstacleLFull = { _time: 0, _duration: 0 };
    let obstacleRFull = { _time: 0, _duration: 0 };
    let obstacleLHalf = { _time: 0, _duration: 0 };
    let obstacleRHalf = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type === 0 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (obstacleLonger(obstacle, obstacleLFull)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    obstacleLFull = obstacle;
                }
                if (obstacleLonger(obstacle, obstacleRFull)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    obstacleRFull = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (obstacleLonger(obstacle, obstacleLFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (obstacleLonger(obstacle, obstacleLFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleRFull = obstacle;
                    }
                }
            }
        }
        else if (obstacle._type === 1 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (obstacleLonger(obstacle, obstacleLHalf)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && obstacleLonger2(obstacle, obstacleLFull) && obstacleLonger2(obstacle, obstacleLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    obstacleLHalf = obstacle;
                }
                if (obstacleLonger(obstacle, obstacleRHalf)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && obstacleLonger2(obstacle, obstacleRFull) && obstacleLonger2(obstacle, obstacleRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    obstacleRHalf = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (obstacleLonger(obstacle, obstacleLHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && obstacleLonger2(obstacle, obstacleLFull) && obstacleLonger2(obstacle, obstacleLHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && obstacleLonger2(obstacle, obstacleRFull) && obstacleLonger2(obstacle, obstacleRHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleRHalf = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (obstacleLonger(obstacle, obstacleLHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && obstacleLonger2(obstacle, obstacleLFull) && obstacleLonger2(obstacle, obstacleLHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && obstacleLonger2(obstacle, obstacleRFull) && obstacleLonger2(obstacle, obstacleRHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        obstacleRHalf = obstacle;
                    }
                }
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

// pain 2 electric boogaloo
// need to figure out only when crouch happen
function detectCrouchObstacle(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let obstacleLFull = { _time: 0, _duration: 0 };
    let obstacleRFull = { _time: 0, _duration: 0 };
    let obstacleLHalf = { _time: 0, _duration: 0 };
    let obstacleRHalf = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type === 0 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (obstacleLonger(obstacle, obstacleLFull)) {
                    obstacleLFull = obstacle;
                }
                if (obstacleLonger(obstacle, obstacleRFull)) {
                    obstacleRFull = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (obstacleLonger(obstacle, obstacleLFull)) {
                        obstacleLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRFull)) {
                        obstacleRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (obstacleLonger(obstacle, obstacleLFull)) {
                        obstacleLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRFull)) {
                        obstacleRFull = obstacle;
                    }
                }
            }
        }
        else if (obstacle._type === 1 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (obstacleLonger(obstacle, obstacleLHalf)) {
                    arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    obstacleLHalf = obstacle;
                }
                if (obstacleLonger(obstacle, obstacleRHalf)) {
                    arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    obstacleRHalf = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (obstacleLonger(obstacle, obstacleLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        obstacleLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        obstacleRHalf = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (obstacleLonger(obstacle, obstacleLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        obstacleLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (obstacleLonger(obstacle, obstacleRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        obstacleRHalf = obstacle;
                    }
                }
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x !== ary[i - 1];
    });
    return arr;
}

// check if current obstacle is longer than previous obstacle
function obstacleLonger(w1, w2) {
    return isAboveTH(w1._time + w1._duration, toRealTime(w2._time + w2._duration))
}
// electric boogaloo; for <15ms obstacle
function obstacleLonger2(w1, w2) {
    return isAboveTH(w1._time + w1._duration, toRealTime(w2._time + w2._duration) + tool.obstacle.minDur)
}