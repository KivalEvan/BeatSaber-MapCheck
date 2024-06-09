import type { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem.ts';
import type { IWrapFxEventFloat, IWrapFxEventFloatAttribute } from './fxEventFloat.ts';
import type { IWrapFxEventInt, IWrapFxEventIntAttribute } from './fxEventInt.ts';

export interface IWrapFxEventsCollectionAttribute extends IWrapBaseItemAttribute {
   floatList: IWrapFxEventFloatAttribute[];
   intList: IWrapFxEventIntAttribute[];
}

export interface IWrapFxEventsCollection extends IWrapBaseItem, IWrapBaseItemAttribute {
   floatList: IWrapFxEventFloat[];
   intList: IWrapFxEventInt[];
}
