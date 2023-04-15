import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';

export interface IWrapBaseObjectAttribute<
    T extends Record<keyof T, unknown> = Record<string, unknown>,
> extends IWrapBaseItemAttribute<T> {
    /** Beat time `<float>` of beatmap object. */
    time: number;
}

export interface IWrapBaseObject<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseItem<T>,
        IWrapBaseObjectAttribute<T> {
    setTime(value: number): this;
}
