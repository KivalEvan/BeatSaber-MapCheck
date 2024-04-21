import type { ICustomDataBase } from '../shared/custom/customData.ts';

export interface IBaseObject {
   /** Beat time `<float>` of beatmap object. */
   _time?: number;
   _customData?: ICustomDataBase;
}
