import type { NoteColor } from '../shared/constants.ts';
import type { IGridObject } from './gridObject.ts';

export interface IBaseSlider extends IGridObject {
   /**
    * Color type `<int>` of base arc.
    * ```ts
    * 0 -> Red
    * 1 -> Blue
    * ```
    */
   c?: NoteColor;
   /**
    * Head cut direction `<int>` of base arc.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    *
    * Grid represents cut direction from center.
    *
    * **WARNING:** Dot-directional is not recommended, assumes down-directional.
    */
   d?: number;
   /** Tail beat time `<float>` of base arc. */
   tb?: number;
   /**
    * Tail position x `<int>` of base arc.
    * ```ts
    * 0 -> Outer Left
    * 1 -> Middle Left
    * 2 -> Middle Right
    * 3 -> Outer Right
    * ```
    *
    * **RANGE:** `none`
    */
   tx?: number;
   /**
    * Tail position y `<int>` of base arc.
    * ```ts
    * 0 -> Bottom row
    * 1 -> Middle row
    * 2 -> Top row
    * ```
    *
    * **RANGE:** `0-2`
    */
   ty?: number;
}
