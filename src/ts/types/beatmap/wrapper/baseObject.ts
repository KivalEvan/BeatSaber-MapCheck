// deno-lint-ignore-file no-explicit-any
import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';

export interface IWrapBaseObjectAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItemAttribute<T> {
   /** Beat time `<float>` of beatmap object. */
   time: number;
}

export interface IWrapBaseObject<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItem<T>,
      IWrapBaseObjectAttribute<T> {
   setTime(value: number): this;
}
