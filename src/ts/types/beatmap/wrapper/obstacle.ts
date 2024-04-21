// deno-lint-ignore-file no-explicit-any
import type { ModType } from '../shared/modCheck.ts';
import type { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject.ts';

export interface IWrapObstacleAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObjectAttribute<T> {
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
}

export interface IWrapObstacle<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObject<T>,
      IWrapObstacleAttribute<T> {
   setDuration(value: number): this;
   setWidth(value: number): this;
   setHeight(value: number): this;

   /**
    * Check if obstacle is interactive.
    * ```ts
    * if (wall.isInteractive()) {}
    * ```
    */
   isInteractive(type?: ModType): boolean;

   /**
    * Check if current obstacle is longer than previous obstacle.
    * ```ts
    * if (wall.isLonger(compareWall)) {}
    * ```
    */
   isLonger(compareTo: IWrapObstacle, prevOffset: number, type?: ModType): boolean;

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
