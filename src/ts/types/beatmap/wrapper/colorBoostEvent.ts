import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';

export interface IWrapColorBoostEventAttribute<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseObjectAttribute<T> {
    /** Toggle `<boolean>` of boost event. */
    toggle: boolean;
}

export interface IWrapColorBoostEvent<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseObject<T>,
        IWrapColorBoostEventAttribute<T> {
    setToggle(value: boolean): this;
}
