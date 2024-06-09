import { EventBoxGroup } from './abstract/eventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import type { IWrapLightTranslationEventBox } from '../../types/beatmap/wrapper/lightTranslationEventBox.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { LightTranslationEventBox } from './lightTranslationEventBox.ts';
import { deepCopy } from '../../utils/misc.ts';

export class LightTranslationEventBoxGroup
   extends EventBoxGroup
   implements IWrapLightTranslationEventBoxGroup
{
   static defaultValue: IWrapLightTranslationEventBoxGroupAttribute = {
      time: 0,
      id: 0,
      boxes: [],
      customData: {},
   };

   static create(
      ...data: DeepPartialIgnore<IWrapLightTranslationEventBoxGroupAttribute, 'customData'>[]
   ): LightTranslationEventBoxGroup[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(
      data: DeepPartialIgnore<IWrapLightTranslationEventBoxGroupAttribute, 'customData'> = {},
   ) {
      super();
      this.time = data.time ?? LightTranslationEventBoxGroup.defaultValue.time;
      this.id = data.id ?? LightTranslationEventBoxGroup.defaultValue.id;
      this.boxes = (data.boxes ?? LightTranslationEventBoxGroup.defaultValue.boxes).map(
         (e) => new LightTranslationEventBox(e),
      );
      this.customData = deepCopy(
         data.customData ?? LightTranslationEventBoxGroup.defaultValue.customData,
      );
   }

   boxes: IWrapLightTranslationEventBox[];
}
