import type { ICustomDataSlider } from '../v3/custom/slider.ts';
import type { IItem } from './item.ts';

export interface IChain extends IItem {
   /**
    * Position x `<int>` of chain.
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
    * Position y `<int>` of chain.
    * ```ts
    * 0 -> Bottom row
    * 1 -> Middle row
    * 2 -> Top row
    * ```
    *
    * **RANGE:** `0-2`
    */
   ty?: number;
   /**
    * Slice count or element `<int>` in chain.
    *
    * **NOTE:** Must be more than `0`, the head counts as `1`.
    */
   c?: number;
   /**
    * Length multiplier `<float>` of element in chain.
    * ```ts
    * 1 -> Normal length
    * 0.5 -> Half length
    * 0.25 -> Quarter length
    * ```
    *
    * **WARNING:** Value `0` will crash the game.
    */
   s?: number;
   customData?: ICustomDataSlider;
}
