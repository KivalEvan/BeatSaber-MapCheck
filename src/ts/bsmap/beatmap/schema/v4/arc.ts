import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWrapArcAttribute } from '../../../types/beatmap/wrapper/arc.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IArcContainer } from '../../../types/beatmap/container/v4.ts';

export const arc: ISchemaContainer<IWrapArcAttribute, IArcContainer> = {
   serialize(data: IWrapArcAttribute): IArcContainer {
      return {
         object: {
            ai: 0,
            hb: data.time,
            hi: 0,
            hr: data.laneRotation,
            tb: data.tailTime,
            ti: 0,
            tr: data.tailLaneRotation,
            customData: {},
         },
         data: {
            m: data.lengthMultiplier,
            tm: data.tailLengthMultiplier,
            a: data.midAnchor,
            customData: deepCopy(data.customData),
         },
         headData: {
            c: data.color,
            x: data.posX,
            y: data.posY,
            d: data.direction,
            a: 0,
            customData: {},
         },
         tailData: {
            c: data.color,
            x: data.tailPosX,
            y: data.tailPosY,
            d: data.tailDirection,
            a: 0,
            customData: {},
         },
      };
   },
   deserialize(data: Partial<IArcContainer> = {}): Partial<IWrapArcAttribute> {
      return {
         time: data.object?.hb,
         laneRotation: data.object?.hr,
         tailTime: data.object?.tb,
         tailLaneRotation: data.object?.tr,
         color: data.headData?.c,
         posX: data.headData?.x,
         posY: data.headData?.y,
         direction: data.headData?.d,
         lengthMultiplier: data.data?.m,
         tailPosX: data.tailData?.x,
         tailPosY: data.tailData?.y,
         tailDirection: data.tailData?.d,
         tailLengthMultiplier: data.data?.tm,
         midAnchor: data.data?.a,
         customData: data.data?.customData,
      };
   },
};
