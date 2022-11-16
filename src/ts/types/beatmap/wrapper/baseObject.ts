import { IWrapBaseItem } from './baseItem';

export interface IWrapBaseObject<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseItem<T> {
    /** Beat time `<float>` of beatmap object. */
    time: number;

    setTime(value: number): this;
}
