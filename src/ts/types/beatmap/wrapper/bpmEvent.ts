import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';

export interface IWrapBPMEventAttribute<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseObjectAttribute<T> {
    /** Value `<float>` of BPM change event. */
    bpm: number;
}

export interface IWrapBPMEvent<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseObject<T>,
        IWrapBPMEventAttribute<T> {
    setBPM(value: number): this;
}
