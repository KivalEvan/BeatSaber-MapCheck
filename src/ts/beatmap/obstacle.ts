import { CustomDataObstacle } from './customData';

export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData?: CustomDataObstacle;
}

interface ObstacleCount {
    total: number;
    interactive: number;
    crouch: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

// FIXME: do i bother with Mapping Extension for obstacle Y position?
export const getPosition = (o: Obstacle): [number, number] => {
    if (o._customData?._position) {
        return [o._customData._position[0], o._customData._position[1]];
    }
    return [
        (o._lineIndex <= -1000
            ? o._lineIndex / 1000
            : o._lineIndex >= 1000
            ? o._lineIndex / 1000
            : o._lineIndex) - 2,
        o._type <= -1000 ? o._type / 1000 : o._type >= 1000 ? o._type / 1000 : o._type,
    ];
};

export const isInteractive = (o: Obstacle): boolean => {
    return o._width >= 2 || o._lineIndex === 1 || o._lineIndex === 2;
};

export const isCrouch = (o: Obstacle): boolean => {
    return o._type === 1 && (o._width > 2 || (o._width === 2 && o._lineIndex === 1));
};

export const isZero = (o: Obstacle): boolean => {
    return o._duration === 0 || o._width === 0;
};

export const isLonger = (cO: Obstacle, pO: Obstacle, offset: number = 0): boolean => {
    return cO._time + cO._duration > pO._time + pO._duration + offset;
};

export const hasChroma = (o: Obstacle): boolean => {
    return Array.isArray(o._customData?._color);
};

export const hasNoodleExtensions = (o: Obstacle): boolean => {
    return (
        Array.isArray(o._customData?._animation) ||
        typeof o._customData?._fake === 'boolean' ||
        typeof o._customData?._interactable === 'boolean' ||
        Array.isArray(o._customData?._localRotation) ||
        typeof o._customData?._noteJumpMovementSpeed === 'number' ||
        typeof o._customData?._noteJumpStartBeatOffset === 'number' ||
        Array.isArray(o._customData?._position) ||
        Array.isArray(o._customData?._rotation) ||
        Array.isArray(o._customData?._scale) ||
        typeof o._customData?._track === 'string'
    );
};

export const hasMappingExtensions = (o: Obstacle): boolean => {
    return o._width >= 1000 || o._type >= 1000 || o._lineIndex > 3 || o._lineIndex < 0;
};

export const isValid = (o: Obstacle): boolean => {
    return !hasMappingExtensions(o) && o._width > 0 && o._width <= 4;
};

export const count = (o: Obstacle[]): ObstacleCount => {
    const obstacleCount: ObstacleCount = {
        total: 0,
        interactive: 0,
        crouch: 0,
        chroma: 0,
        noodleExtensions: 0,
        mappingExtensions: 0,
    };
    for (let i = o.length - 1; i >= 0; i--) {
        obstacleCount.total++;
        if (isInteractive(o[i])) {
            obstacleCount.interactive++;
        }
        if (isCrouch(o[i])) {
            obstacleCount.crouch++;
        }
        if (hasChroma(o[i])) {
            obstacleCount.chroma++;
        }
        if (hasNoodleExtensions(o[i])) {
            obstacleCount.noodleExtensions++;
        }
        if (hasMappingExtensions(o[i])) {
            obstacleCount.mappingExtensions++;
        }
    }
    return obstacleCount;
};
