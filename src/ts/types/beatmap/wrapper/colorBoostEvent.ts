// deno-lint-ignore-file no-explicit-any
import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';

export interface IWrapColorBoostEventAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseObjectAttribute<T> {
   /** Toggle `<boolean>` of boost event. */
   toggle: boolean;
}

export interface IWrapColorBoostEvent<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseObject<T>,
      IWrapColorBoostEventAttribute<T> {
   setToggle(value: boolean): this;
}
