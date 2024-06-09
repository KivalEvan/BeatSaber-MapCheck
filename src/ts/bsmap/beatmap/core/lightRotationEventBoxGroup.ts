import { EventBoxGroup } from './abstract/eventBoxGroup.ts';
import type {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import type { IWrapLightRotationEventBox } from '../../types/beatmap/wrapper/lightRotationEventBox.ts';
import type { DeepPartialIgnore } from '../../types/utils.ts';
import { LightRotationEventBox } from './lightRotationEventBox.ts';
import { deepCopy } from '../../utils/misc.ts';

export class LightRotationEventBoxGroup
   extends EventBoxGroup
   implements IWrapLightRotationEventBoxGroup
{
   static defaultValue: IWrapLightRotationEventBoxGroupAttribute = {
      time: 0,
      id: 0,
      boxes: [],
      customData: {},
   };

   static create(
      ...data: DeepPartialIgnore<IWrapLightRotationEventBoxGroupAttribute, 'customData'>[]
   ): LightRotationEventBoxGroup[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(
      data: DeepPartialIgnore<IWrapLightRotationEventBoxGroupAttribute, 'customData'> = {},
   ) {
      super();
      this.time = data.time ?? LightRotationEventBoxGroup.defaultValue.time;
      this.id = data.id ?? LightRotationEventBoxGroup.defaultValue.id;
      this.boxes = (data.boxes ?? LightRotationEventBoxGroup.defaultValue.boxes).map(
         (e) => new LightRotationEventBox(e),
      );
      this.customData = deepCopy(
         data.customData ?? LightRotationEventBoxGroup.defaultValue.customData,
      );
   }

   boxes: IWrapLightRotationEventBox[];
}
