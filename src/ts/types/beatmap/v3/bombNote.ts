import type { IGridObject } from './gridObject.ts';
import type { ICustomDataNote } from './custom/note.ts';

export interface IBombNote extends IGridObject {
   customData?: ICustomDataNote;
}
