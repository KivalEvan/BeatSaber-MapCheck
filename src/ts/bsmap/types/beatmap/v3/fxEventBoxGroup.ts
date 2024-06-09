import type { IEventBoxGroup } from './eventBoxGroup.ts';
import type { IFxEventBox } from './fxEventBox.ts';

export interface IFxEventBoxGroup extends IEventBoxGroup<IFxEventBox> {
   /**
    * Type `<int>` of FX event.
    * ```ts
    * 0 -> Int
    * 1 -> Float
    * 2 -> Bool
    * ```
    */
   t?: 0 | 1 | 2;
}
