import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IObstacleContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapObstacleAttribute } from '../../../types/beatmap/wrapper/obstacle.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { DeepPartial } from '../../../types/utils.ts';

export const obstacle: ISchemaContainer<IWrapObstacleAttribute, IObstacleContainer> = {
   serialize(data: IWrapObstacleAttribute): IObstacleContainer {
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
            d: data.duration,
            w: data.width,
            h: data.height,
            customData: deepCopy(data.customData),
         },
      };
   },
   deserialize(data: DeepPartial<IObstacleContainer> = {}): Partial<IWrapObstacleAttribute> {
      return {
         time: data.object?.b,
         laneRotation: data.object?.r,
         posX: data.data?.x,
         posY: data.data?.y,
         duration: data.data?.d,
         width: data.data?.w,
         height: data.data?.h,
         customData: data.data?.customData,
      };
   },
};
