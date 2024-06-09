import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IWrapArcAttribute } from '../../../types/beatmap/wrapper/arc.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IArcContainer } from '../../../types/beatmap/container/v4.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';

const defaultValue = {
   object: {
      ai: 0,
      hb: 0,
      hi: 0,
      hr: 0,
      tb: 0,
      ti: 0,
      tr: 0,
      customData: {},
   },
   data: {
      m: 0,
      tm: 0,
      a: 0,
      customData: {},
   },
   headData: {
      c: 0,
      x: 0,
      y: 0,
      d: 0,
      a: 0,
      customData: {},
   },
   tailData: {
      c: 0,
      x: 0,
      y: 0,
      d: 0,
      a: 0,
      customData: {},
   },
} as DeepRequiredIgnore<IArcContainer, 'customData'>;
export const arc: ISchemaContainer<IWrapArcAttribute, IArcContainer> = {
   defaultValue,
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
         time: data.object?.hb ?? defaultValue.object.hb,
         laneRotation: data.object?.hr ?? defaultValue.object.hr,
         tailTime: data.object?.tb ?? defaultValue.object.tb,
         tailLaneRotation: data.object?.tr ?? defaultValue.object.tr,
         color: data.headData?.c ?? defaultValue.headData.c,
         posX: data.headData?.x ?? defaultValue.headData.x,
         posY: data.headData?.y ?? defaultValue.headData.y,
         direction: data.headData?.d ?? defaultValue.headData.d,
         lengthMultiplier: data.data?.m ?? defaultValue.data.m,
         tailPosX: data.tailData?.x ?? defaultValue.tailData.x,
         tailPosY: data.tailData?.y ?? defaultValue.tailData.y,
         tailDirection: data.tailData?.d ?? defaultValue.tailData.c,
         tailLengthMultiplier: data.data?.tm ?? defaultValue.data.tm,
         midAnchor: data.data?.a ?? defaultValue.data.a,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
