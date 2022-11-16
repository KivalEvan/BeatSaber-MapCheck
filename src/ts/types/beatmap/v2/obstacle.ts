import { ICustomDataObstacle } from './custom/customData';
import { IBaseObject } from './object';

/** Beatmap object interface for Obstacle. */
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
     * 2 -> Freeform Wall
     * ```
     */
    _type: number;
    _duration: number;
    _width: number;
    _height: number;
    _customData?: ICustomDataObstacle;
}
