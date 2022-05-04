import { ICustomDataObstacle } from '../shared/customData';
import { IBaseObject } from './object';

/** Beatmap object interface for Obstacle.
 * ```ts
 * _time: float,
 * _lineIndex: int,
 * _type: int,
 * _duration: float,
 * _width: int,
 * _customData?: JSON
 * ```
 */
export interface IObstacle extends IBaseObject {
    /** Obstacle placement on column.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     */
    _lineIndex: number;
    _lineLayer: number;
    /** Type of obstacle.
     * ```ts
     * 0 -> Full-height Wall
     * 1 -> Crouch Wall
     * ```
     */
    _type: number;
    _duration: number;
    _width: number;
    _height: number;
    _customData?: ICustomDataObstacle;
}

export interface ObstacleCount {
    total: number;
    interactive: number;
    crouch: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}
