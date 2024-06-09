import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightColorEvent } from '../../../types/beatmap/v3/lightColorEvent.ts';
import type { IWrapLightColorEventAttribute } from '../../../types/beatmap/wrapper/lightColorEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { EaseType, TransitionType } from '../../shared/constants.ts';

const defaultValue = {
   b: 0,
   i: 0,
   c: 0,
   s: 0,
   f: 0,
   sb: 0,
   sf: 0,
   customData: {},
} as Required<ILightColorEvent>;
export const lightColorEvent: ISchemaContainer<IWrapLightColorEventAttribute, ILightColorEvent> = {
   defaultValue,
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
         time: data.b ?? defaultValue.b,
         color: data.c ?? defaultValue.c,
         frequency: data.f ?? defaultValue.f,
         previous: data.i === TransitionType.EXTEND ? 1 : 0,
         easing:
            (data.i ?? defaultValue.i) === TransitionType.INTERPOLATE
               ? EaseType.LINEAR
               : EaseType.NONE,
         brightness: data.s ?? defaultValue.s,
         strobeBrightness: data.sb ?? defaultValue.sb,
         strobeFade: data.sf ?? defaultValue.sf,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
