import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';

export interface IWrapBaseObjectAttribute extends IWrapBaseItemAttribute {
   /** Beat time `<float>` of beatmap object. */
   time: number;
}

export interface IWrapBaseObject extends IWrapBaseItem, IWrapBaseObjectAttribute {
   setTime(value: number): this;
}
