// it's nothing, planned to expand further for obstacle related
// TODO: crouch wall detection
// TODO: <15ms wall detection
function countInteractiveObstacle(obstacles) {
    let count = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width >= 2 || obstacles[i]._lineIndex == 1 || obstacles[i]._lineIndex == 2)
            count++;
    return count;
}
