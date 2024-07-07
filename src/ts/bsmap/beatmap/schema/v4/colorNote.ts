import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IColorNoteContainer } from '../../../types/beatmap/container/v4.ts';
import type { DeepPartial } from '../../../types/utils.ts';

export const colorNote: ISchemaContainer<IWrapColorNoteAttribute, IColorNoteContainer> = {
   serialize(data: IWrapColorNoteAttribute): IColorNoteContainer {
      return {
         object: {
            b: data.time,
            i: 0,
            r: data.laneRotation,
            customData: {},
         },
         data: {
            c: data.color,
            x: data.posX,
            y: data.posY,
            d: data.direction,
            a: data.angleOffset,
            customData: deepCopy(data.customData),
         },
      };
   },
   deserialize(data: DeepPartial<IColorNoteContainer> = {}): Partial<IWrapColorNoteAttribute> {
      return {
         time: data.object?.b,
         laneRotation: data.object?.r,
         posX: data.data?.x,
         posY: data.data?.y,
         color: data.data?.c,
         direction: data.data?.d,
         angleOffset: data.data?.a,
         customData: data.data?.customData,
      };
   },
};
