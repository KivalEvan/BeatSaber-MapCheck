import { ICustomDataBase } from '../shared/custom/customData';

export interface IBaseObject {
   /** Beat time `<float>` of beatmap object. */
   _time: number;
   _customData?: ICustomDataBase;
}
