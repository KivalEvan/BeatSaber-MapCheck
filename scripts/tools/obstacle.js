 /* OBSTACLE SCRIPT - obstacle.js
    it's nothing, planned to expand further for obstacle related
    TODO: crouch wall detection */

function countInteractiveObstacle(obstacles) {
    let count = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width > 1 || obstacles[i]._lineIndex == 1 || obstacles[i]._lineIndex == 2)
            count++;
    return count;
}

function detectZeroWall(obstacles, bpm, offset, bpmc) {
    let arr = [];
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (obstacles[i]._width == 0 || (toRealTime(obstacles[i]._duration) < 0.001 && !obstacles[i]._duration < 0)) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    return arr;
}

function detectInvalidWall(obstacles, bpm, offset, bpmc) {
    let arr = [];
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (obstacles[i]._width > 4 || obstacles[i]._lineIndex > 3 || obstacles[i]._type > 1 || obstacles[i]._type < 0) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        }
        else if (obstacles[i]._width == 4 && obstacles[i]._lineIndex > 0) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        }
        else if (obstacles[i]._width == 3 && obstacles[i]._lineIndex > 1) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        }
        else if (obstacles[i]._width == 2 && obstacles[i]._lineIndex > 2) {
            arr.push(adjustTime(obstacles[i]._time, bpm, offset, bpmc));
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
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
        return !i || x != ary[i - 1];
    });
    return arr;
}

// god this was more complicated than i thought, but i dont think it should
function detectCenterWall(obstacles, bpm, offset, bpmc) {
    let arr = [];
    let wallLFull = { _time: 0, _duration: 0 };
    let wallRFull = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type == 0) {
            if (obstacle._width > 2) {
                arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                if (wallLonger(obstacle, wallLFull)) {
                    wallLFull = obstacle;
                }
                if (wallLonger(obstacle, wallRFull)) {
                    wallRFull = obstacle;
                }
            }
            else if (obstacle._width > 1 && obstacle._lineIndex == 1) {
                arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                if (wallLonger(obstacle, wallLFull)) {
                    wallLFull = obstacle;
                }
                if (wallLonger(obstacle, wallRFull)) {
                    wallRFull = obstacle;
                }
            }
            else if (obstacle._width == 2) {
                if (obstacle._lineIndex == 0) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (aboveTH(obstacle._time, toRealTime(wallRFull._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(wallRFull._time + wallRFull._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (aboveTH(obstacle._time, toRealTime(wallLFull._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(wallLFull._time + wallLFull._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width == 1) {
                if (obstacle._lineIndex == 1) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (aboveTH(obstacle._time, toRealTime(wallRFull._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(wallRFull._time + wallRFull._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (aboveTH(obstacle._time, toRealTime(wallLFull._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(wallLFull._time + wallLFull._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
                    }
                }
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    return arr;
}

// overly complicated stuff again
// jfc i need to put these repetition in function or somethin
// pain
function detectShortWall(obstacles, bpm, offset, bpmc) {
    let arr = [];
    let wallLFull = { _time: 0, _duration: 0 };
    let wallRFull = { _time: 0, _duration: 0 };
    let wallLHalf = { _time: 0, _duration: 0 };
    let wallRHalf = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type == 0 && obstacle._duration > 0) {
            if (obstacle._width > 2) {
                if (wallLonger(obstacle, wallLFull)) {
                    if (belowTH(obstacle._duration, minWallDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallLFull = obstacle;
                }
                if (wallLonger(obstacle, wallRFull)) {
                    if (belowTH(obstacle._duration, minWallDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallRFull = obstacle;
                }
            }
            else if (obstacle._width > 1 && obstacle._lineIndex == 1) {
                if (wallLonger(obstacle, wallLFull)) {
                    if (belowTH(obstacle._duration, minWallDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallLFull = obstacle;
                }
                if (wallLonger(obstacle, wallRFull)) {
                    if (belowTH(obstacle._duration, minWallDur)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallRFull = obstacle;
                }
            }
            else if (obstacle._width == 2) {
                if (obstacle._lineIndex == 0) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (belowTH(obstacle._duration, minWallDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (belowTH(obstacle._duration, minWallDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
                    }
                }
            }
            else if (obstacle._width == 1) {
                if (obstacle._lineIndex == 1) {
                    if (wallLonger(obstacle, wallLFull)) {
                        if (belowTH(obstacle._duration, minWallDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLFull = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (wallLonger(obstacle, wallRFull)) {
                        if (belowTH(obstacle._duration, minWallDur)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRFull = obstacle;
                    }
                }
            }
        }
        else if (obstacle._type == 1 && obstacle._duration > 0) {
            if (obstacle._width > 2) {
                if (wallLonger(obstacle, wallLHalf)) {
                    if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallLFull) && wallLonger2(obstacle, wallLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallLHalf = obstacle;
                }
                if (wallLonger(obstacle, wallRHalf)) {
                    if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallRFull) && wallLonger2(obstacle, wallRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallRHalf = obstacle;
                }
            }
            else if (obstacle._width > 1 && obstacle._lineIndex == 1) {
                if (wallLonger(obstacle, wallLHalf)) {
                    if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallLFull) && wallLonger2(obstacle, wallLHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallLHalf = obstacle;
                }
                if (wallLonger(obstacle, wallRHalf)) {
                    if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallRFull) && wallLonger2(obstacle, wallRHalf)) {
                        arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                    }
                    wallRHalf = obstacle;
                }
            }
            else if (obstacle._width == 2) {
                if (obstacle._lineIndex == 0) {
                    if (wallLonger(obstacle, wallLHalf)) {
                        if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallLFull) && wallLonger2(obstacle, wallLHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (wallLonger(obstacle, wallRHalf)) {
                        if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallRFull) && wallLonger2(obstacle, wallRHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRHalf = obstacle;
                    }
                }
            }
            else if (obstacle._width == 1) {
                if (obstacle._lineIndex == 1) {
                    if (wallLonger(obstacle, wallLHalf)) {
                        if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallLFull) && wallLonger2(obstacle, wallLHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallLHalf = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (wallLonger(obstacle, wallRHalf)) {
                        if (belowTH(obstacle._duration, minWallDur) && wallLonger2(obstacle, wallRFull) && wallLonger2(obstacle, wallRHalf)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        wallRHalf = obstacle;
                    }
                }
            }
            else if (obstacle._width > 1 || obstacle._lineIndex == 1 || obstacle._lineIndex == 2) {
                if (belowTH(obstacle._duration, minWallDur) && obstacle._time > 0) {
                    arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                }
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    return arr;
}

// check if current wall is longer than previous wall
function wallLonger(w1, w2) {
    return aboveTH(w1._time + w1._duration, toRealTime(w2._time + w2._duration))
}
// electric boogaloo; for <15ms wall
function wallLonger2(w1, w2) {
    return aboveTH(w1._time + w1._duration, toRealTime(w2._time + w2._duration) + minWallDur)
}