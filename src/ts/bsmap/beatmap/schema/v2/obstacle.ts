import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IObstacle } from '../../../types/beatmap/v2/obstacle.ts';
import type { IWrapObstacleAttribute } from '../../../types/beatmap/wrapper/obstacle.ts';
import { remap } from '../../../utils/math.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   _time: 0,
   _lineIndex: 0,
   _type: 0,
   _duration: 0,
   _width: 0,
   _customData: {},
} as Required<IObstacle>;
export const obstacle: ISchemaContainer<IWrapObstacleAttribute, IObstacle> = {
   defaultValue,
   serialize(data: IWrapObstacleAttribute): IObstacle {
      let type = 0;
      if (data.height >= 0 && data.posY >= 0) {
         type = Math.floor(data.height * 1000 + data.posY + 4001);
      }
      return {
         _time: data.time,
         _type:
            data.posY === 2 && data.height === 3
               ? 1
               : data.posY === 0 && data.height === 5
                 ? 0
                 : type,
         _lineIndex: data.posX,
         _duration: data.duration,
         _width: data.width,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IObstacle> = {}): Partial<IWrapObstacleAttribute> {
      const type = data._type ?? defaultValue._type;
      const height =
         type === 1
            ? 3
            : type >= 1000 && type <= 4000
              ? remap(type, 1000, 4000, 0, 15)
              : type > 4000 && type <= 4005000
                ? 0
                : 5;
      const posY =
         type === 1 ? 2 : type > 4000 && type <= 4005000 ? Math.floor((type - 4001) / 1000) : 0;
      return {
         time: data._time ?? defaultValue._time,
         posY,
         posX: data._lineIndex ?? defaultValue._lineIndex,
         duration: data._duration ?? defaultValue._duration,
         width: data._width ?? defaultValue._width,
         height,
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };
   },
};
