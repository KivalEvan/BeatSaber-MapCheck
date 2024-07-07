import type { IBombNote } from '../../../types/beatmap/v3/bombNote.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

export const bombNote: ISchemaContainer<IWrapBombNoteAttribute, IBombNote> = {
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
         time: data.b,
         posX: data.x,
         posY: data.y,
         customData: data.customData,
      };
   },
};
