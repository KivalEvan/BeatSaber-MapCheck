import type { Vector3 } from '../../../types/vector.ts';
import type { IChromaEnvironment } from '../../../types/beatmap/v3/custom/chroma.ts';
import type { IChromaEnvironmentPlacement } from '../types/environment.ts';
import { deepCopy } from '../../../utils/misc.ts';

/** **IMPORTANT:** Manually adjust block to be exactly 1x1x1 unity unit (1x1x1 scale does usually not work) */
export class EnvironmentBlock {
   data: IChromaEnvironment;
   anchor: Vector3;
   static startLightID = 100;
   static index = 0;
   protected constructor(data: IChromaEnvironment, anchor: Vector3) {
      this.data = data;
      this.anchor = anchor;
   }
   static create(data: IChromaEnvironment, anchor: Vector3): EnvironmentBlock {
      return new this(data, anchor);
   }

   place(options: IChromaEnvironmentPlacement, insertTo?: never): IChromaEnvironment;
   place(options: IChromaEnvironmentPlacement, insertTo: IChromaEnvironment[]): void;
   place(
      options: IChromaEnvironmentPlacement,
      insertTo?: IChromaEnvironment[],
   ): IChromaEnvironment | void {
      const d = deepCopy(this.data);
      const scale = options.scale
         ? ((d.scale ? d.scale : [1, 1, 1]).map((s, i) => s * options.scale![i]) as Vector3)
         : d.scale;
      const position = options.position
         ? (options.position.map(
              (p, i) => p + this.anchor[i] * (options.scale?.[i] || 1),
           ) as Vector3)
         : ((d.position ? d.position : [0, 0, 0]).map(
              (p, i) => p + this.anchor[i] * (options.scale?.[i] ?? 1),
           ) as Vector3);
      const rotation = options.rotation
         ? (options.rotation.map((r, i) => r + (d.rotation?.[i] ?? 0)) as Vector3)
         : d.rotation;
      const components = {
         ...d.components,
      };
      if (typeof components.ILightWithId?.type === 'number') {
         if (typeof options.type === 'number') {
            components.ILightWithId.type = options.type;
         }
         components.ILightWithId.lightID = EnvironmentBlock.startLightID + EnvironmentBlock.index++;
      }
      if (options.track) {
         d.track = options.track;
      }
      const data = {
         ...d,
         scale,
         position,
         rotation,
      };
      if (Object.entries(components).length) {
         data.components = components;
      }
      if (insertTo) {
         insertTo.push(data);
         return;
      }
      return data;
   }
}
