import type { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup.ts';
import type {
   IWrapLightRotationEventBox,
   IWrapLightRotationEventBoxAttribute,
} from './lightRotationEventBox.ts';

export interface IWrapLightRotationEventBoxGroupAttribute extends IWrapEventBoxGroupAttribute {
   boxes: IWrapLightRotationEventBoxAttribute[];
}

export interface IWrapLightRotationEventBoxGroup
   extends IWrapEventBoxGroup,
      IWrapLightRotationEventBoxGroupAttribute {
   boxes: IWrapLightRotationEventBox[];
}
