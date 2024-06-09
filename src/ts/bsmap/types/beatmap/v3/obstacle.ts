import type { IGridObject } from './gridObject.ts';
import type { ICustomDataObstacle } from './custom/obstacle.ts';

export interface IObstacle extends IGridObject {
   /** Duration `<float>` of obstacle.*/
   d?: number;
   /**
    * Width `<int>` of obstacle.
    *
    * **RANGE:** `none`
    */
   w?: number;
   /**
    * Height `<int>` of obstacle.
    * ```ts
    * 1 -> Short
    * 2 -> Moderate
    * 3 -> Crouch
    * 4 -> Tall
    * 5 -> Full
    * ```
    *
    * **RANGE:** `1-5`
    */
   h?: number;
   customData?: ICustomDataObstacle;
}
