import { IWrapBaseObject } from './baseObject';

export interface IWrapColorBoostEvent extends IWrapBaseObject {
    /** Toggle `<boolean>` of boost event. */
    toggle: boolean;

    setToggle(value: boolean): this;
}
