import { IGridObject } from './gridObject';
import { ICustomDataNote } from './custom/note';

export interface IBombNote extends IGridObject {
   customData?: ICustomDataNote;
}
