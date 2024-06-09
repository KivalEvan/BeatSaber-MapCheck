import type { IColorNote } from '../../../types/beatmap/v3/colorNote.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
   b: 0,
   c: 0,
   x: 0,
   y: 0,
   d: 0,
   a: 0,
   customData: {},
} as Required<IColorNote>;
export const colorNote: ISchemaContainer<IWrapColorNoteAttribute, IColorNote> = {
   defaultValue,
   serialize(data: IWrapColorNoteAttribute): IColorNote {
      return {
         b: data.time,
         c: data.color,
         x: data.posX,
         y: data.posY,
         d: data.direction,
         a: data.angleOffset,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IColorNote> = {}): Partial<IWrapColorNoteAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         posX: data.x ?? defaultValue.x,
         posY: data.y ?? defaultValue.y,
         color: data.c ?? defaultValue.c,
         direction: data.d ?? defaultValue.d,
         angleOffset: data.a ?? defaultValue.a,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
