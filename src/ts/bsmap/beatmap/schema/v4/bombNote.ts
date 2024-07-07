import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { IBombNoteContainer } from '../../../types/beatmap/container/v4.ts';
import type { DeepPartial } from '../../../types/utils.ts';

export const bombNote: ISchemaContainer<IWrapBombNoteAttribute, IBombNoteContainer> = {
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
         time: data.object?.b,
         laneRotation: data.object?.r,
         posX: data.data?.x,
         posY: data.data?.y,
         customData: data.data?.customData,
      };
   },
};
