import type { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup.ts';
import type {
   IWrapLightColorEventBox,
   IWrapLightColorEventBoxAttribute,
} from './lightColorEventBox.ts';

export interface IWrapLightColorEventBoxGroupAttribute extends IWrapEventBoxGroupAttribute {
   boxes: IWrapLightColorEventBoxAttribute[];
}

export interface IWrapLightColorEventBoxGroup
   extends IWrapEventBoxGroup,
      IWrapLightColorEventBoxGroupAttribute {
   boxes: IWrapLightColorEventBox[];
}
