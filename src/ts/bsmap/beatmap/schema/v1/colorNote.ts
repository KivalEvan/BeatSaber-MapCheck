import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { INote } from '../../../types/beatmap/v1/note.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';

export const colorNote: ISchemaContainer<IWrapColorNoteAttribute, INote> = {
   serialize(data: IWrapColorNoteAttribute): INote {
      return {
         _time: data.time,
         _lineIndex: data.posX,
         _lineLayer: data.posY,
         _type: data.color,
         _cutDirection: data.direction,
      };
   },
   deserialize(data: Partial<INote> = {}): Partial<IWrapColorNoteAttribute> {
      return {
         time: data._time,
         posX: data._lineIndex,
         posY: data._lineLayer,
         color: data._type as 0,
         direction: data._cutDirection,
      };
   },
};
