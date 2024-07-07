import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IChain } from '../../../types/beatmap/v3/chain.ts';
import type { IWrapChainAttribute } from '../../../types/beatmap/wrapper/chain.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const chain: ISchemaContainer<IWrapChainAttribute, IChain> = {
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
         time: data.b,
         color: data.c,
         posX: data.x,
         posY: data.y,
         direction: data.d,
         tailTime: data.tb,
         tailPosX: data.tx,
         tailPosY: data.ty,
         sliceCount: data.sc,
         squish: data.s,
         customData: data.customData,
      };
   },
};
