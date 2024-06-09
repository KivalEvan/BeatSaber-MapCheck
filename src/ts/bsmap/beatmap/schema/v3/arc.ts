import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IArc } from '../../../types/beatmap/v3/arc.ts';
import type { IWrapArcAttribute } from '../../../types/beatmap/wrapper/arc.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   c: 0,
   x: 0,
   y: 0,
   d: 0,
   mu: 0,
   tb: 0,
   tx: 0,
   ty: 0,
   tc: 0,
   tmu: 0,
   m: 0,
   customData: {},
} as Required<IArc>;
export const arc: ISchemaContainer<IWrapArcAttribute, IArc> = {
   defaultValue,
   serialize(data: IWrapArcAttribute): IArc {
      return {
         b: data.time,
         c: data.color,
         x: data.posX,
         y: data.posY,
         d: data.direction,
         mu: data.lengthMultiplier,
         tb: data.tailTime,
         tx: data.tailPosX,
         ty: data.tailPosY,
         tc: data.tailDirection,
         tmu: data.tailLengthMultiplier,
         m: data.midAnchor,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IArc> = {}): Partial<IWrapArcAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         color: data.c ?? defaultValue.c,
         posX: data.x ?? defaultValue.x,
         posY: data.y ?? defaultValue.y,
         direction: data.d ?? defaultValue.d,
         lengthMultiplier: data.mu ?? defaultValue.mu,
         tailTime: data.tb ?? defaultValue.tb,
         tailPosX: data.tx ?? defaultValue.tx,
         tailPosY: data.ty ?? defaultValue.ty,
         tailDirection: data.tc ?? defaultValue.tc,
         tailLengthMultiplier: data.tmu ?? defaultValue.tmu,
         midAnchor: data.m ?? defaultValue.m,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
