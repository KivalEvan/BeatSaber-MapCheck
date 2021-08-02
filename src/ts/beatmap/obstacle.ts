import { CustomDataObstacle } from './customData';

export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData?: CustomDataObstacle;
    [key: string]: any;
}

interface ObstacleCount {
    total: number;
    interactive: number;
    crouch: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export const isInteractive = (obstacle: Obstacle): boolean => {
    return obstacle._width >= 2 || obstacle._lineIndex === 1 || obstacle._lineIndex === 2;
};

export const isCrouch = (obstacle: Obstacle): boolean => {
    return (
        obstacle._type === 1 &&
        (obstacle._width > 2 || (obstacle._width === 2 && obstacle._lineIndex === 1))
    );
};

export const isZero = (obstacle: Obstacle): boolean => {
    return obstacle._duration === 0 || obstacle._width === 0;
};

export const hasChroma = (obstacle: Obstacle): boolean => {
    return Array.isArray(obstacle._customData?._color);
};

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

export const hasMappingExtensions = (obstacle: Obstacle): boolean => {
    return (
        obstacle._width > 4 ||
        obstacle._type >= 1000 ||
        obstacle._lineIndex >= 1000 ||
        obstacle._lineIndex <= -1000
    );
};

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
