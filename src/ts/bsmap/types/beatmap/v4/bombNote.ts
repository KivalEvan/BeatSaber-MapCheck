import type { IGrid } from './grid.ts';
import type { ICustomDataNote } from '../v3/custom/note.ts';

export interface IBombNote extends IGrid {
   customData?: ICustomDataNote;
}
