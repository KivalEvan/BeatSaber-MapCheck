// deno-lint-ignore-file no-explicit-any

import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';
import type { IWrapFxEventFloat, IWrapFxEventFloatAttribute } from './fxEventFloat.ts';
import type { IWrapFxEventInt, IWrapFxEventIntAttribute } from './fxEventInt.ts';

export interface IWrapFxEventsCollectionAttribute<
   T extends { [P in keyof T]: T[P] } = Record<string, any>,
> extends IWrapBaseItemAttribute<T> {
   floatList: IWrapFxEventFloatAttribute[];
   intList: IWrapFxEventIntAttribute[];
}

export interface IWrapFxEventsCollection<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapBaseItem<T>,
      IWrapBaseItemAttribute<T> {
   floatList: IWrapFxEventFloat[];
   intList: IWrapFxEventInt[];
}
