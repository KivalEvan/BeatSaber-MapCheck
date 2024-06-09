import type { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup.ts';
import type { IWrapFxEventBox, IWrapFxEventBoxAttribute } from './fxEventBox.ts';

export interface IWrapFxEventBoxGroupAttribute extends IWrapEventBoxGroupAttribute {
   boxes: IWrapFxEventBoxAttribute[];
}

export interface IWrapFxEventBoxGroup extends IWrapEventBoxGroup, IWrapFxEventBoxGroupAttribute {
   boxes: IWrapFxEventBox[];
}
