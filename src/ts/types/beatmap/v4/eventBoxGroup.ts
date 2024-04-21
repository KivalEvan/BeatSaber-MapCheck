import type { IEventBox } from './eventBox.ts';
import type { IItem } from './item.ts';

export interface IEventBoxGroup extends IItem {
   /**
    * Type `<int>` of event box group
    *
    * ```ts
    * 0 -> None
    * 1 -> Color
    * 2 -> Rotation
    * 3 -> Translation
    * 4 -> FX
    * ```
    */
   t?: 0 | 1 | 2 | 3 | 4;
   /** Group ID `<int>` of event box group */
   g?: number;
   b?: number;
   e?: IEventBox[];
}
