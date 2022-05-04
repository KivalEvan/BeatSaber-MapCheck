import { ICustomDataBase } from '../shared/customData';

export interface IBaseObject {
    /** Beat time `<float>` of beatmap object. */
    b: number;
    customData?: ICustomDataBase;
}
