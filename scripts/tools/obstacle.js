 /* OBSTACLE SCRIPT - obstacle.js
    it's nothing, planned to expand further for obstacle related
    TODO: crouch wall detection
    TODO: <15ms wall detection
    TODO: 3-wide wall detection */

function countInteractiveObstacle(obstacles) {
    let count = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width > 1 || obstacles[i]._lineIndex == 1 || obstacles[i]._lineIndex == 2)
            count++;
    return count;
}

function detectZeroWall(obstacles, bpm, offset, bpmc) {
    let arr = [];
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i]._width == 0 || (toRealTime(obstacles[i]._duration) < 0.001 && !obstacles[i]._duration < 0)) {
            arr.push(adjustTime(obstacles._time, bpm, offset, bpmc));
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    return arr;
}

function detectNegativeWall(obstacles, bpm, offset, bpmc) {
    let arr = [];
    for (let i = obstacles.length - 1; i >= 0; i--) {
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
    let occL = { _time: 0, _duration: 0 };
    let occR = { _time: 0, _duration: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._type == 0) {
            if (obstacle._width > 2) {
                arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occL._time + occL._duration))) {
                    occL = obstacle;
                }
                if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occR._time + occR._duration))) {
                    occR = obstacle;
                }
            }
            else if (obstacle._width > 1 && obstacle._lineIndex == 1) {
                arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occL._time + occL._duration))) {
                    occL = obstacle;
                }
                if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occR._time + occR._duration))) {
                    occR = obstacle;
                }
            }
            else if (obstacle._width == 2) {
                if (obstacle._lineIndex == 0) {
                    if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occL._time + occL._duration))) {
                        if (aboveTH(obstacle._time, toRealTime(occR._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(occR._time + occR._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        occL = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occR._time + occR._duration))) {
                        if (aboveTH(obstacle._time, toRealTime(occL._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(occL._time + occL._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        occR = obstacle;
                    }
                }
            }
            else if (obstacle._width == 1) {
                if (obstacle._lineIndex == 1) {
                    if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occL._time + occL._duration))) {
                        if (aboveTH(obstacle._time, toRealTime(occR._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(occR._time + occR._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        occL = obstacle;
                    }
                }
                else if (obstacle._lineIndex == 2) {
                    if (aboveTH(obstacle._time + obstacle._duration, toRealTime(occR._time + occR._duration))) {
                        if (aboveTH(obstacle._time, toRealTime(occL._time) - minWallRecover) && belowTH(obstacle._time, toRealTime(occL._time + occL._duration) + minWallRecover)) {
                            arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
                        }
                        occR = obstacle;
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

// ill look after wall inside wall later
function detectShortWall(obstacles, bpm, offset, bpmc) {
    let arr = [];
    let occL = { _time: 0, _duration: 0, _type: 0 };
    let occR = { _time: 0, _duration: 0, _type: 0 };
    for (let i = 0, len = obstacles.length; i < len; i++) {
        const obstacle = obstacles[i];
        if (obstacle._width > 1 || obstacle._lineIndex == 1 || obstacle._lineIndex == 2) {
            if (belowTH(obstacle._duration, minWallDur) && obstacle._time > 0) {
                arr.push(adjustTime(obstacle._time, bpm, offset, bpmc));
            }
        }
    }
    arr = arr.filter(function(x, i, ary) {
        return !i || x != ary[i - 1];
    });
    return arr;
}
