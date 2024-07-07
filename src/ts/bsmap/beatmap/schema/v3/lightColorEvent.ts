import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorEvent } from '../../../types/beatmap/v3/lightColorEvent.ts';
import type { IWrapLightColorEventAttribute } from '../../../types/beatmap/wrapper/lightColorEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { EaseType, TransitionType } from '../../shared/constants.ts';

export const lightColorEvent: ISchemaContainer<IWrapLightColorEventAttribute, ILightColorEvent> = {
   serialize(data: IWrapLightColorEventAttribute): ILightColorEvent {
      return {
         b: data.time,
         c: data.color,
         f: data.frequency,
         i: data.previous
            ? TransitionType.EXTEND
            : data.easing === EaseType.NONE
              ? TransitionType.INSTANT
              : TransitionType.INTERPOLATE,
         s: data.brightness,
         sb: data.strobeBrightness,
         sf: data.strobeFade,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<ILightColorEvent> = {}): Partial<IWrapLightColorEventAttribute> {
      return {
         time: data.b,
         color: data.c,
         frequency: data.f,
         previous: data.i === TransitionType.EXTEND ? 1 : 0,
         easing: data.i === TransitionType.INTERPOLATE ? EaseType.LINEAR : EaseType.NONE,
         brightness: data.s,
         strobeBrightness: data.sb,
         strobeFade: data.sf,
         customData: data.customData,
      };
   },
};
