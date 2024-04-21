import type { IBaseObject } from './baseObject.ts';

export interface IGridObject extends IBaseObject {
   /**
    * Position x `<int>` of base note.
    * ```ts
    * 0 -> Outer Left
    * 1 -> Middle Left
    * 2 -> Middle Right
    * 3 -> Outer Right
    * ```
    *
    * **RANGE:** `0-3`
    */
   x?: number;
   /**
    * Position y `<int>` of base note.
    * ```ts
    * 0 -> Bottom row
    * 1 -> Middle row
    * 2 -> Top row
    * ```
    *
    * **RANGE:** `0-2`
    */
   y?: number;
}
