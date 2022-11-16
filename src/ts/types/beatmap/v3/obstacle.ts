import { IGridObject } from './gridObject';
import { ICustomDataObstacle } from './custom/customData';

export interface IObstacle extends IGridObject {
    /** Duration `<float>` of obstacle.*/
    d: number;
    /** Width `<int>` of obstacle.
     * ---
     * Range: `none`
     */
    w: number;
    /** Height `<int>` of obstacle.
     * ```ts
     * 1 -> Short
     * 2 -> Moderate
     * 3 -> Crouch
     * 4 -> Tall
     * 5 -> Full
     * ```
     * ---
     * Range: `1-5`
     */
    h: number;
    customData?: ICustomDataObstacle;
}
