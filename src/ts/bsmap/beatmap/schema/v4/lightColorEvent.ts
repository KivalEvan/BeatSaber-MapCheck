import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorEventContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapLightColorEventAttribute } from '../../../types/beatmap/wrapper/lightColorEvent.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { DeepPartial } from '../../../types/utils.ts';

const defaultValue = {
   data: {
      p: 0,
      c: 0,
      e: 0,
      b: 0,
      f: 0,
      sb: 0,
      sf: 0,
      customData: {},
   },
   time: 0,
} as DeepRequiredIgnore<ILightColorEventContainer, 'customData'>;
export const lightColorEvent: ISchemaContainer<
   IWrapLightColorEventAttribute,
   ILightColorEventContainer
> = {
   defaultValue,
   serialize(data: IWrapLightColorEventAttribute): ILightColorEventContainer {
      return {
         data: {
            p: data.previous,
            c: data.color,
            e: data.easing,
            b: data.brightness,
            f: data.frequency,
            sb: data.strobeBrightness,
            sf: data.strobeFade,
            customData: deepCopy(data.customData),
         },
         time: data.time,
      };
   },
   deserialize(
      data: DeepPartial<ILightColorEventContainer> = {},
   ): Partial<IWrapLightColorEventAttribute> {
      return {
         time: data.time ?? defaultValue.time,
         previous: data.data?.p ?? defaultValue.data.p,
         color: data.data?.c ?? defaultValue.data.c,
         frequency: data.data?.f ?? defaultValue.data.f,
         easing: data.data?.e ?? defaultValue.data.e,
         brightness: data.data?.b ?? defaultValue.data.b,
         strobeBrightness: data.data?.sb ?? defaultValue.data.sb,
         strobeFade: data.data?.sf ?? defaultValue.data.sf,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
