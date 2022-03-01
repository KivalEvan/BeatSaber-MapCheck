import { BaseObject } from './baseObject';

/** obstacle beatmap object. */
export interface Obstacle extends BaseObject {
    /** Position x `<int>` of obstacle.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `no limit`
     */
    x: number;
    /** Position y `<int>` of obstacle.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    y: number;
    /** Duration `<float>` of obstacle.*/
    d: number;
    /** Width `<int>` of obstacle.
     * ---
     * Range: `no limit`
     */
    w: number;
    /** Height `<int>` of obstacle.
     * ```ts
     * 1 -> Square
     * 2 -> 1x2
     * 3 -> 1x3
     * 4 -> 1x4
     * 5 -> 1x5
     * ```
     * ---
     * Range: `1-5`
     */
    h: number;
}
