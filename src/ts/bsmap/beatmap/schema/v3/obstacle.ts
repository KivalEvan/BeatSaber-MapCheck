import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IObstacle } from '../../../types/beatmap/v3/obstacle.ts';
import type { IWrapObstacleAttribute } from '../../../types/beatmap/wrapper/obstacle.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const obstacle: ISchemaContainer<IWrapObstacleAttribute, IObstacle> = {
   serialize(data: IWrapObstacleAttribute): IObstacle {
      return {
         b: data.time,
         x: data.posX,
         y: data.posY,
         d: data.duration,
         w: data.width,
         h: data.height,
         customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IObstacle> = {}): Partial<IWrapObstacleAttribute> {
      return {
         time: data.b,
         posX: data.x,
         posY: data.y,
         duration: data.d,
         width: data.w,
         height: data.h,
         customData: data.customData,
      };
   },
};
