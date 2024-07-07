import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { INote } from '../../../types/beatmap/v2/note.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const bombNote: ISchemaContainer<IWrapBombNoteAttribute, INote> = {
   serialize(data: IWrapBombNoteAttribute): INote {
      return {
         _time: data.time,
         _type: 3,
         _lineIndex: data.posX,
         _lineLayer: data.posY,
         _cutDirection: data.direction,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<INote> = {}): Partial<IWrapBombNoteAttribute> {
      return {
         time: data._time,
         posX: data._lineIndex,
         posY: data._lineLayer,
         customData: data._customData,
      };
   },
};
