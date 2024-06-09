import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { INote } from '../../../types/beatmap/v2/note.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   _time: 0,
   _lineIndex: 0,
   _lineLayer: 0,
   _type: 0,
   _cutDirection: 0,
   _customData: {},
} as Required<INote>;
export const colorNote: ISchemaContainer<IWrapColorNoteAttribute, INote> = {
   defaultValue,
   serialize(data: IWrapColorNoteAttribute): INote {
      return {
         _time: data.time,
         _type: data.color,
         _lineIndex: data.posX,
         _lineLayer: data.posY,
         _cutDirection: data.direction,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<INote> = {}): Partial<IWrapColorNoteAttribute> {
      return {
         time: data._time ?? defaultValue._time,
         posX: data._lineIndex ?? defaultValue._lineIndex,
         posY: data._lineLayer ?? defaultValue._lineLayer,
         color: (data._type ?? defaultValue._type) as 0,
         direction: data._cutDirection ?? defaultValue._cutDirection,
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };
   },
};
