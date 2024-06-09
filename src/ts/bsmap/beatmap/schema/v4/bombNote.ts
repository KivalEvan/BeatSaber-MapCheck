import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { IBombNoteContainer } from '../../../types/beatmap/container/v4.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';

const defaultValue = {
   object: {
      b: 0,
      i: 0,
      r: 0,
      customData: {},
   },
   data: {
      x: 0,
      y: 0,
      customData: {},
   },
} as DeepRequiredIgnore<IBombNoteContainer, 'customData'>;
export const bombNote: ISchemaContainer<IWrapBombNoteAttribute, IBombNoteContainer> = {
   defaultValue,
   serialize(data: IWrapBombNoteAttribute): Required<IBombNoteContainer> {
      return {
         object: {
            b: data.time,
            i: 0,
            r: data.laneRotation,
            customData: {},
         },
         data: {
            x: data.posX,
            y: data.posY,
            customData: deepCopy(data.customData),
         },
      };
   },
   deserialize(data: DeepPartial<IBombNoteContainer> = {}): Partial<IWrapBombNoteAttribute> {
      return {
         time: data.object?.b ?? defaultValue.object.b,
         laneRotation: data.object?.r ?? defaultValue.object.r,
         posX: data.data?.x ?? defaultValue.data.x,
         posY: data.data?.y ?? defaultValue.data.y,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
