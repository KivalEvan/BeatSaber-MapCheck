import { CustomDataObstacle } from './customData';

/**
 * Beatmap object interface for Obstacle.
 *
 *     _time: float,
 *     _lineIndex: int,
 *     _type: int,
 *     _duration: float,
 *     _width: int,
 *     _customData?: JSON
 */
export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData?: CustomDataObstacle;
}

export interface ObstacleCount {
    total: number;
    interactive: number;
    crouch: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}
