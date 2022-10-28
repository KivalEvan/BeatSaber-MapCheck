import { IWrapBaseItem } from './baseItem';

export interface IWrapBaseObject extends IWrapBaseItem {
    /** Beat time `<float>` of beatmap object. */
    time: number;

    setTime(value: number): this;
}
