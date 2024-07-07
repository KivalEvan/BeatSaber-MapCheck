import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ISpawnRotationContainer } from '../../../types/beatmap/container/v4.ts';
import type { IWrapRotationEventAttribute } from '../../../types/beatmap/wrapper/rotationEvent.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const rotationEvent: ISchemaContainer<IWrapRotationEventAttribute, ISpawnRotationContainer> =
   {
      serialize(data: IWrapRotationEventAttribute): ISpawnRotationContainer {
         return {
            object: { b: data.time },
            data: {
               e: data.executionTime,
               r: data.rotation,
               customData: deepCopy(data.customData),
            },
         };
      },
      deserialize(
         data: DeepPartial<ISpawnRotationContainer> = {},
      ): Partial<IWrapRotationEventAttribute> {
         return {
            time: data.object?.b,
            executionTime: data.data?.e,
            rotation: data.data?.r,
            customData: data.data?.customData,
         };
      },
   };
