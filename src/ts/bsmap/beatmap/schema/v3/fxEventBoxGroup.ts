import type { DeepPartial } from '../../../types/utils.ts';
import { fxEventBox } from './fxEventBox.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IFxEventBox } from '../../../types/beatmap/v3/fxEventBox.ts';
import type { IWrapFxEventBoxGroupAttribute } from '../../../types/beatmap/wrapper/fxEventBoxGroup.ts';
import type {
   IEventBoxGroupContainer,
   IFxEventFloatBoxContainer,
} from '../../../types/beatmap/container/v3.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';
import { FxType } from '../../../types/beatmap/shared/constants.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
   object: { t: FxType.FLOAT, b: 0, g: 0, e: [], customData: {} },
   boxData: [],
} as DeepRequiredIgnore<
   IEventBoxGroupContainer<IFxEventBox, IFxEventFloatBoxContainer>,
   'customData'
>;
export const fxEventBoxGroup: ISchemaContainer<
   IWrapFxEventBoxGroupAttribute,
   IEventBoxGroupContainer<IFxEventBox, IFxEventFloatBoxContainer>
> = {
   defaultValue,
   serialize(
      data: IWrapFxEventBoxGroupAttribute,
   ): IEventBoxGroupContainer<IFxEventBox, IFxEventFloatBoxContainer> {
      return {
         object: {
            t: FxType.FLOAT,
            b: data.time,
            g: data.id,
            e: [],
            customData: deepCopy(data.customData),
         },
         boxData: data.boxes.map(fxEventBox.serialize),
      };
   },
   deserialize(
      data: DeepPartial<IEventBoxGroupContainer<IFxEventBox, IFxEventFloatBoxContainer>> = {},
   ): DeepPartial<IWrapFxEventBoxGroupAttribute> {
      const d: DeepPartial<IWrapFxEventBoxGroupAttribute> = {};
      d.time = data.object?.b ?? defaultValue.object.b;
      d.id = data.object?.g ?? defaultValue.object.g;
      d.boxes = (data.boxData ?? defaultValue.boxData).map(fxEventBox.deserialize);
      d.customData = deepCopy(data.object?.customData ?? defaultValue.object.customData);
      return d;
   },
};
