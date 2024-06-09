import type { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';

export interface IWrapEventBoxGroupAttribute extends IWrapBaseObjectAttribute {
   /** Group ID `<int>` of event box group */
   id: number;
   boxes: IWrapEventBoxAttribute[];
}

export interface IWrapEventBoxGroup extends IWrapBaseObject, IWrapEventBoxGroupAttribute {
   boxes: IWrapEventBox[];
}
