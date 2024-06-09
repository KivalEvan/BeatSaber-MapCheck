import type { GetPositionFn } from '../shared/functions.ts';
import type { ICustomDataObstacle } from './custom/obstacle.ts';
import type { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject.ts';

export interface IWrapObstacleAttribute extends IWrapGridObjectAttribute {
   /** Duration `<float>` of obstacle.*/
   duration: number;
   /**
    * Width `<int>` of obstacle.
    *
    * **RANGE:** `none`
    */
   width: number;
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
   height: number;
   customData: ICustomDataObstacle;
}

export interface IWrapObstacle extends Omit<IWrapGridObject, 'customData'>, IWrapObstacleAttribute {
   setCustomData(object: this['customData']): this;
   addCustomData(object: this['customData']): this;

   setDuration(value: number): this;
   setWidth(value: number): this;
   setHeight(value: number): this;

   /**
    * Check if obstacle is interactive.
    * ```ts
    * if (wall.isInteractive()) {}
    * ```
    */
   isInteractive(fn?: GetPositionFn<this>): boolean;

   /**
    * Check if current obstacle is longer than previous obstacle.
    * ```ts
    * if (wall.isLonger(compareWall)) {}
    * ```
    */
   isLonger(compareTo: this, prevOffset?: number, fn?: GetPositionFn<this>): boolean;

   /**
    * Check if obstacle has zero value.
    * ```ts
    * if (wall.hasZero()) {}
    * ```
    */
   hasZero(): boolean;

   /**
    * Check if obstacle has negative value.
    * ```ts
    * if (wall.hasNegative()) {}
    * ```
    */
   hasNegative(): boolean;
}
