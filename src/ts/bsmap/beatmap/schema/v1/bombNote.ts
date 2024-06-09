import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { INote } from '../../../types/beatmap/v1/note.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';

const defaultValue = {
   _time: 0,
   _lineIndex: 0,
   _lineLayer: 0,
   _type: 3,
   _cutDirection: 0,
} as Required<INote>;
export const bombNote: ISchemaContainer<IWrapBombNoteAttribute, INote> = {
   defaultValue,
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
         time: data._time ?? defaultValue._time,
         posX: data._lineIndex ?? defaultValue._lineIndex,
         posY: data._lineLayer ?? defaultValue._lineLayer,
         direction: data._cutDirection ?? defaultValue._cutDirection,
      };
   },
};
