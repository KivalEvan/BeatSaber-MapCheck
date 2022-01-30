import { Obstacle, ObstacleCount } from './types/obstacle';

/**
 * Get obstacle and return the Beatwalls' position x and y value in tuple.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {[number, number]} Beatwalls' position x and y value in tuple
 */
// FIXME: do i bother with Mapping Extension for obstacle Y position?
export const getPosition = (obstacle: Obstacle): [number, number] => {
    if (obstacle._customData?._position) {
        return [obstacle._customData._position[0], obstacle._customData._position[1]];
    }
    return [
        (obstacle._lineIndex <= -1000
            ? obstacle._lineIndex / 1000
            : obstacle._lineIndex >= 1000
            ? obstacle._lineIndex / 1000
            : obstacle._lineIndex) - 2,
        obstacle._type <= -1000
            ? obstacle._type / 1000
            : obstacle._type >= 1000
            ? obstacle._type / 1000
            : obstacle._type,
    ];
};

/**
 * Check if obstacle is interactive.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {boolean} If obstacle is interactive
 */
export const isInteractive = (obstacle: Obstacle): boolean => {
    return (
        obstacle._width >= 2 || obstacle._lineIndex === 1 || obstacle._lineIndex === 2
    );
};

/**
 * Check if obstacle is crouch.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {boolean} If obstacle is crouch
 */
export const isCrouch = (obstacle: Obstacle): boolean => {
    return (
        obstacle._type === 1 &&
        (obstacle._width > 2 || (obstacle._width === 2 && obstacle._lineIndex === 1))
    );
};

/**
 * Check if obstacle is crouch.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {boolean} If obstacle is crouch
 */
export const isZero = (obstacle: Obstacle): boolean => {
    return obstacle._duration === 0 || obstacle._width === 0;
};

/**
 * Check if current obstacle is longer than previous obstacle.
 * @param {Obstacle} obstacle - Current beatmap obstacle
 * @param {Obstacle} obstacle - Previous beatmap obstacle
 * @param {number} offset - Add offset to previous beatmap obstacle
 * @returns {boolean} If current obstacle is longer than previous obstacle
 */
export const isLonger = (
    currObstacle: Obstacle,
    prevObstacle: Obstacle,
    offset = 0
): boolean => {
    return (
        currObstacle._time + currObstacle._duration >
        prevObstacle._time + prevObstacle._duration + offset
    );
};

/**
 * Check if obstacle has Chroma properties.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {boolean} If obstacle has Chroma properties
 */
export const hasChroma = (obstacle: Obstacle): boolean => {
    return Array.isArray(obstacle._customData?._color);
};

/**
 * Check if obstacle has Noodle Extensions properties.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {boolean} If obstacle has Noodle Extensions properties
 */
export const hasNoodleExtensions = (obstacle: Obstacle): boolean => {
    return (
        Array.isArray(obstacle._customData?._animation) ||
        typeof obstacle._customData?._fake === 'boolean' ||
        typeof obstacle._customData?._interactable === 'boolean' ||
        Array.isArray(obstacle._customData?._localRotation) ||
        typeof obstacle._customData?._noteJumpMovementSpeed === 'number' ||
        typeof obstacle._customData?._noteJumpStartBeatOffset === 'number' ||
        Array.isArray(obstacle._customData?._position) ||
        Array.isArray(obstacle._customData?._rotation) ||
        Array.isArray(obstacle._customData?._scale) ||
        typeof obstacle._customData?._track === 'string'
    );
};

/**
 * Check if obstacle has Mapping Extensions properties.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {boolean} If obstacle has Mapping Extensions properties
 */
export const hasMappingExtensions = (obstacle: Obstacle): boolean => {
    return (
        obstacle._width >= 1000 ||
        obstacle._type >= 1000 ||
        obstacle._lineIndex > 3 ||
        obstacle._lineIndex < 0
    );
};

/**
 * Check if obstacle is a valid, vanilla obstacle.
 * @param {Obstacle} obstacle - Beatmap obstacle
 * @returns {boolean} If obstacle is a valid, vanilla obstacle
 */
export const isValid = (obstacle: Obstacle): boolean => {
    return (
        !hasMappingExtensions(obstacle) && obstacle._width > 0 && obstacle._width <= 4
    );
};

/**
 * Count number of type of obstacles with their properties in given array and return a obstacle count object.
 * @param {Obstacle[]} obstacles - Array of beatmap obstacle
 * @returns {EventCount} Obstacle count object
 */
export const count = (obstacles: Obstacle[]): ObstacleCount => {
    const obstacleCount: ObstacleCount = {
        total: 0,
        interactive: 0,
        crouch: 0,
        chroma: 0,
        noodleExtensions: 0,
        mappingExtensions: 0,
    };
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacleCount.total++;
        if (isInteractive(obstacles[i])) {
            obstacleCount.interactive++;
        }
        if (isCrouch(obstacles[i])) {
            obstacleCount.crouch++;
        }
        if (hasChroma(obstacles[i])) {
            obstacleCount.chroma++;
        }
        if (hasNoodleExtensions(obstacles[i])) {
            obstacleCount.noodleExtensions++;
        }
        if (hasMappingExtensions(obstacles[i])) {
            obstacleCount.mappingExtensions++;
        }
    }
    return obstacleCount;
};
