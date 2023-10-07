import { IBaseItem } from './baseItem';

export interface IBaseObject extends IBaseItem {
   /** Beat time `<float>` of beatmap object. */
   b: number;
}
