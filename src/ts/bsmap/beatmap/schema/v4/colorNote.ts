import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IColorNoteContainer } from '../../../types/beatmap/container/v4.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';
import type { DeepPartial } from '../../../types/utils.ts';

const defaultValue = {
   object: {
      b: 0,
      i: 0,
      r: 0,
      customData: {},
   },
   data: {
      c: 0,
      x: 0,
      y: 0,
      d: 0,
      a: 0,
      customData: {},
   },
} as DeepRequiredIgnore<IColorNoteContainer, 'customData'>;
export const colorNote: ISchemaContainer<IWrapColorNoteAttribute, IColorNoteContainer> = {
   defaultValue,
   serialize(data: IWrapColorNoteAttribute): IColorNoteContainer {
      return {
         object: {
            b: data.time,
            i: 0,
            r: data.laneRotation,
            customData: {},
         },
         data: {
            c: data.color,
            x: data.posX,
            y: data.posY,
            d: data.direction,
            a: data.angleOffset,
            customData: deepCopy(data.customData),
         },
      };
   },
   deserialize(data: DeepPartial<IColorNoteContainer> = {}): Partial<IWrapColorNoteAttribute> {
      return {
         time: data.object?.b ?? defaultValue.object.b,
         laneRotation: data.object?.r ?? defaultValue.object.r,
         posX: data.data?.x ?? defaultValue.data.x,
         posY: data.data?.y ?? defaultValue.data.y,
         color: data.data?.c ?? defaultValue.data.c,
         direction: data.data?.d ?? defaultValue.data.d,
         angleOffset: data.data?.a ?? defaultValue.data.a,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
