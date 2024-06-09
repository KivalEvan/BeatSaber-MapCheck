import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapColorBoostEventAttribute extends IWrapBaseObjectAttribute {
   /** Toggle `<boolean>` of boost event. */
   toggle: boolean;
}

export interface IWrapColorBoostEvent extends IWrapBaseObject, IWrapColorBoostEventAttribute {
   setToggle(value: boolean): this;
}
