import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IObstacleContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapObstacleAttribute } from '../../../types/beatmap/wrapper/obstacle.ts';
import type { DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { DeepPartial } from '../../../types/utils.ts';

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
      d: 0,
      w: 0,
      h: 0,
      customData: {},
   },
} as DeepRequiredIgnore<IObstacleContainer, 'customData'>;
export const obstacle: ISchemaContainer<IWrapObstacleAttribute, IObstacleContainer> = {
   defaultValue,
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
         time: data.object?.b ?? defaultValue.object.b,
         laneRotation: data.object?.r ?? defaultValue.object.r,
         posX: data.data?.x ?? defaultValue.data.x,
         posY: data.data?.y ?? defaultValue.data.y,
         duration: data.data?.d ?? defaultValue.data.d,
         width: data.data?.w ?? defaultValue.data.w,
         height: data.data?.h ?? defaultValue.data.h,
         customData: deepCopy(data.data?.customData ?? defaultValue.data.customData),
      };
   },
};
