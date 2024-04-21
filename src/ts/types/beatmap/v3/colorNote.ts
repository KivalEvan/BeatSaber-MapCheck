import type { IGridObject } from './gridObject.ts';
import type { ICustomDataNote } from './custom/note.ts';
import type { NoteColor } from '../shared/constants.ts';

export interface IColorNote extends IGridObject {
   /**
    * Color type `<int>` of note.
    * ```ts
    * 0 -> Red
    * 1 -> Blue
    * ```
    */
   c?: NoteColor;
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
   d?: number;
   /** Angle offset in degree counter-clockwise `<int>` of note.*/
   a?: number;
   customData?: ICustomDataNote;
}
