import { IGridObject } from './gridObject';
import { ICustomDataNote } from './custom/customData';

export interface IBombNote extends IGridObject {
    customData?: ICustomDataNote;
}
