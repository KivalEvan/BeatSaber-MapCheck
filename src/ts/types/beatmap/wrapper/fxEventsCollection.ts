// deno-lint-ignore-file no-explicit-any

import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';
import { IWrapFxEventFloat, IWrapFxEventFloatAttribute } from './fxEventFloat';
import { IWrapFxEventInt, IWrapFxEventIntAttribute } from './fxEventInt';

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
