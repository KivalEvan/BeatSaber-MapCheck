import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IChain } from '../../../types/beatmap/v3/chain.ts';
import type { IWrapChainAttribute } from '../../../types/beatmap/wrapper/chain.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   b: 0,
   c: 0,
   x: 0,
   y: 0,
   d: 0,
   tb: 0,
   tx: 0,
   ty: 0,
   sc: 0,
   s: 0,
   customData: {},
} as Required<IChain>;
export const chain: ISchemaContainer<IWrapChainAttribute, IChain> = {
   defaultValue,
   serialize(data: IWrapChainAttribute): IChain {
      return {
         b: data.time,
         c: data.color,
         x: data.posX,
         y: data.posY,
         d: data.direction,
         tb: data.tailTime,
         tx: data.tailPosX,
         ty: data.tailPosY,
         sc: data.sliceCount,
         s: data.squish,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IChain> = {}): Partial<IWrapChainAttribute> {
      return {
         time: data.b ?? defaultValue.b,
         color: data.c ?? defaultValue.c,
         posX: data.x ?? defaultValue.x,
         posY: data.y ?? defaultValue.y,
         direction: data.d ?? defaultValue.d,
         tailTime: data.tb ?? defaultValue.tb,
         tailPosX: data.tx ?? defaultValue.tx,
         tailPosY: data.ty ?? defaultValue.ty,
         sliceCount: data.sc ?? defaultValue.sc,
         squish: data.s ?? defaultValue.s,
         customData: deepCopy(data.customData ?? defaultValue.customData),
      };
   },
};
