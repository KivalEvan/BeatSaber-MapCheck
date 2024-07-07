import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { INote } from '../../../types/beatmap/v1/note.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';

export const bombNote: ISchemaContainer<IWrapBombNoteAttribute, INote> = {
   serialize(data: IWrapBombNoteAttribute): INote {
      return {
         _time: data.time,
         _lineIndex: data.posX,
         _lineLayer: data.posY,
         _type: 3,
         _cutDirection: data.direction,
      };
   },
   deserialize(data: Partial<INote> = {}): Partial<IWrapBombNoteAttribute> {
      return {
         time: data._time,
         posX: data._lineIndex,
         posY: data._lineLayer,
         direction: data._cutDirection,
      };
   },
};
