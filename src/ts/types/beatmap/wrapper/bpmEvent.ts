import { IWrapBaseObject } from './baseObject';

export interface IWrapBPMEvent extends IWrapBaseObject {
    /** Value `<float>` of BPM change event. */
    bpm: number;

    setBPM(value: number): this;
}
