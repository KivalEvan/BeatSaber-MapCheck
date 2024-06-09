import type { IWrapEventBoxGroup, IWrapEventBoxGroupAttribute } from './eventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBox,
   IWrapLightTranslationEventBoxAttribute,
} from './lightTranslationEventBox.ts';

export interface IWrapLightTranslationEventBoxGroupAttribute extends IWrapEventBoxGroupAttribute {
   boxes: IWrapLightTranslationEventBoxAttribute[];
}

export interface IWrapLightTranslationEventBoxGroup
   extends IWrapEventBoxGroup,
      IWrapLightTranslationEventBoxGroupAttribute {
   boxes: IWrapLightTranslationEventBox[];
}
