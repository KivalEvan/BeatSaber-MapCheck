import type { ISpawnRotationContainer } from '../../types/beatmap/container/v4.ts';
import type { IObject } from '../../types/beatmap/v4/object.ts';
import type { ISpawnRotation } from '../../types/beatmap/v4/spawnRotation.ts';
import type { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapRotationEvent } from '../wrapper/rotationEvent.ts';

/** Rotation event beatmap v3 class object. */
export class SpawnRotation extends WrapRotationEvent<ISpawnRotationContainer> {
   static default: DeepRequiredIgnore<ISpawnRotationContainer, 'customData'> = {
      object: { b: 0, i: 0, customData: {} },
      data: { e: 0, r: 0, customData: {} },
   };

   static create(...data: Partial<IWrapRotationEventAttribute<ISpawnRotation>>[]): SpawnRotation[] {
      const result: SpawnRotation[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapRotationEventAttribute<ISpawnRotation>> = {}) {
      super();
      this._time = data.time ?? SpawnRotation.default.object.b;
      this._executionTime = data.executionTime ?? SpawnRotation.default.data.e;
      this._rotation = data.rotation ?? SpawnRotation.default.data.r;
      this._customData = deepCopy(data.customData ?? SpawnRotation.default.data.customData);
   }

   static fromJSON(
      object: Partial<IObject> = {},
      data: Partial<ISpawnRotation> = {},
   ): SpawnRotation {
      const d = new this();
      d._time = object.b ?? SpawnRotation.default.object.b;
      d._executionTime = data.e ?? SpawnRotation.default.data.e;
      d._rotation = data.r ?? SpawnRotation.default.data.r;
      d._customData = deepCopy(data.customData ?? SpawnRotation.default.data.customData);
      return d;
   }

   toJSON(): Required<ISpawnRotationContainer> {
      return {
         object: { b: this.time },
         data: {
            e: this.executionTime,
            r: this.rotation,
            customData: deepCopy(this.customData),
         },
      };
   }

   get customData(): NonNullable<ISpawnRotation['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ISpawnRotation['customData']>) {
      this._customData = value;
   }
}
