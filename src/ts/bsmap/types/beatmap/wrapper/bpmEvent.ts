import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapBPMEventAttribute extends IWrapBaseObjectAttribute {
   /** Value `<float>` of BPM change event. */
   bpm: number;
}

export interface IWrapBPMEvent extends IWrapBaseObject, IWrapBPMEventAttribute {
   setBPM(value: number): this;
}
