import { IBaseNote } from './baseNote';
import { ICustomDataNote } from './customData';

export interface IBombNote extends IBaseNote {
    customData?: ICustomDataNote;
}
