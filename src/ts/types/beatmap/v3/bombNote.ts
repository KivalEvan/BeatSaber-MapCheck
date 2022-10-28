import { IGridObject } from './gridObject';
import { ICustomDataNote } from './customData';

export interface IBombNote extends IGridObject {
    customData?: ICustomDataNote;
}
