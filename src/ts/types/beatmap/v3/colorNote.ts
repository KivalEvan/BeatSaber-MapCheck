import { IGridObject } from './gridObject';
import { ICustomDataNote } from './custom/note';

export interface IColorNote extends IGridObject {
   /**
    * Color type `<int>` of note.
    * ```ts
    * 0 -> Red
    * 1 -> Blue
    * ```
    */
   c: 0 | 1;
   /**
    * Cut direction `<int>` of note.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    *
    * Grid represents cut direction from center.
    *
    * **WARNING:** Dot-directional is not recommended with arcs, assumes down-directional.
    */
   d: number;
   /** Angle offset in degree counter-clockwise `<int>` of note.*/
   a: number;
   customData?: ICustomDataNote;
}
