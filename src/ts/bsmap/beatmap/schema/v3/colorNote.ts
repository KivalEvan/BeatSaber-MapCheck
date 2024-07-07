import type { IColorNote } from '../../../types/beatmap/v3/colorNote.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

export const colorNote: ISchemaContainer<IWrapColorNoteAttribute, IColorNote> = {
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
         time: data.b,
         posX: data.x,
         posY: data.y,
         color: data.c,
         direction: data.d,
         angleOffset: data.a,
         customData: data.customData,
      };
   },
};
