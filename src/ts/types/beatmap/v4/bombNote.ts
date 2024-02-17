import { IGrid } from './grid';
import { ICustomDataNote } from '../v3/custom/note';

export interface IBombNote extends IGrid {
   customData?: ICustomDataNote;
}
