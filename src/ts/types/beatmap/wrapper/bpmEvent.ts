// deno-lint-ignore-file no-explicit-any
import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';

export interface IWrapBPMEventAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObjectAttribute<T> {
   /** Value `<float>` of BPM change event. */
   bpm: number;
}

export interface IWrapBPMEvent<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapBPMEventAttribute<T> {
   setBPM(value: number): this;
}
