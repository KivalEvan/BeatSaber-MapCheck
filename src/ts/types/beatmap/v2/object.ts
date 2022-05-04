import { ICustomDataBase } from '../shared/customData';

export interface IBaseObject {
    /** Beat time `<float>` of beatmap object. */
    _time: number;
    _customData?: ICustomDataBase;
}
