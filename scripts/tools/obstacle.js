 /* OBSTACLE SCRIPT - obstacle.js
    it's nothing, planned to expand further for obstacle related
    TODO: crouch wall detection */

function countInteractiveObstacle(obstacles) {
    let count = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width > 1 || obstacles[i]._lineIndex === 1 || obstacles[i]._lineIndex === 2)
            count++;
    return count;
}

function detectZeroWall(diff, mapSettings) {
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

function detectInvalidWall(diff, mapSettings) {
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

function detectNegativeWall(obstacles, bpm, offset, bpmc) {
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
function detectCenterWall(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let wallLFull = { _time: 0, _duration: 0 };
    let wallRFull = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type === 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                if (wallLonger(obstacle, wallLFull)) {
                    wallLFull = obstacle;
                }
                if (wallLonger(obstacle, wallRFull)) {
                    wallRFull = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(wallRFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(wallRFull._time + wallRFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(wallLFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(wallLFull._time + wallLFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(wallRFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(wallRFull._time + wallRFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (isAboveTH(obstacle._time, toRealTime(wallLFull._time) - tool.obstacle.recovery) && isBelowTH(obstacle._time, toRealTime(wallLFull._time + wallLFull._duration) + tool.obstacle.recovery)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
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
function detectShortWall(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let wallLFull = { _time: 0, _duration: 0 };
    let wallRFull = { _time: 0, _duration: 0 };
    let wallLHalf = { _time: 0, _duration: 0 };
    let wallRHalf = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type === 0 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (wallLonger(obstacle, wallLFull)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallLFull = obstacle;
                }
                if (wallLonger(obstacle, wallRFull)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallRFull = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
                    }
                }
            }
        }
        else if (obstacle._type === 1 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (wallLonger(obstacle, wallLHalf)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && wallLonger2(obstacle, wallLFull) && wallLonger2(obstacle, wallLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallLHalf = obstacle;
                }
                if (wallLonger(obstacle, wallRHalf)) {
                    if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && wallLonger2(obstacle, wallRFull) && wallLonger2(obstacle, wallRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallRHalf = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (wallLonger(obstacle, wallLHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && wallLonger2(obstacle, wallLFull) && wallLonger2(obstacle, wallLHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && wallLonger2(obstacle, wallRFull) && wallLonger2(obstacle, wallRHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRHalf = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (wallLonger(obstacle, wallLHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && wallLonger2(obstacle, wallLFull) && wallLonger2(obstacle, wallLHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRHalf)) {
                        if (isBelowTH(obstacle._duration, tool.obstacle.minDur) && wallLonger2(obstacle, wallRFull) && wallLonger2(obstacle, wallRHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRHalf = obstacle;
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
function detectCrouchWall(diff, mapSettings) {
    const { _obstacles: obstacles } = diff;
    const { bpm, bpmc, offset } = mapSettings;
    let arr = [];
    let wallLFull = { _time: 0, _duration: 0 };
    let wallRFull = { _time: 0, _duration: 0 };
    let wallLHalf = { _time: 0, _duration: 0 };
    let wallRHalf = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type === 0 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (wallLonger(obstacle, wallLFull)) {
                    wallLFull = obstacle;
                }
                if (wallLonger(obstacle, wallRFull)) {
                    wallRFull = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (wallLonger(obstacle, wallLFull)) {
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        wallRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (wallLonger(obstacle, wallLFull)) {
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        wallRFull = obstacle;
                    }
                }
            }
        }
        else if (obstacle._type === 1 && obstacle._duration > 0) {
            if (obstacle._width > 2 || (obstacle._width > 1 && obstacle._lineIndex === 1)) {
                if (wallLonger(obstacle, wallLHalf)) {
                    arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    wallLHalf = obstacle;
                }
                if (wallLonger(obstacle, wallRHalf)) {
                    arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    wallRHalf = obstacle;
                }
            }
            else if (obstacle._width === 2) {
                if (obstacle._lineIndex === 0) {
                    if (wallLonger(obstacle, wallLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        wallLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        wallRHalf = obstacle;
                    }
                }
            }
            else if (obstacle._width === 1) {
                if (obstacle._lineIndex === 1) {
                    if (wallLonger(obstacle, wallLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        wallLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex === 2) {
                    if (wallLonger(obstacle, wallRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        wallRHalf = obstacle;
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

// check if current wall is longer than previous wall
function wallLonger(w1, w2) {
    return isAboveTH(w1._time + w1._duration, toRealTime(w2._time + w2._duration))
}
// electric boogaloo; for <15ms wall
function wallLonger2(w1, w2) {
    return isAboveTH(w1._time + w1._duration, toRealTime(w2._time + w2._duration) + tool.obstacle.minDur)
}