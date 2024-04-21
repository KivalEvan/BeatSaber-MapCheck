import type { IBaseItem } from './baseItem.ts';

export interface IBaseObject extends IBaseItem {
   /** Beat time `<float>` of beatmap object. */
   b?: number;
}
