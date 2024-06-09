import type { IBombNote } from '../../../types/beatmap/v3/bombNote.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
   b: 0,
   x: 0,
   y: 0,
   customData: {},
} as Required<IBombNote>;
export const bombNote: ISchemaContainer<IWrapBombNoteAttribute, IBombNote> = {
   defaultValue,
   serialize(data: IWrapBombNoteAttribute): IBombNote {
      return {
         b: data.time,
         x: data.posX,
         y: data.posY,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IBombNote> = {}): Partial<IWrapBombNoteAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         posX: data.x ?? defaultValue.x,
         posY: data.y ?? defaultValue.y,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
