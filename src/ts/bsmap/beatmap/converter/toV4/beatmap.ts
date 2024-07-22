import logger from '../../../logger.ts';
import type { IWrapBeatmap } from '../../../types/beatmap/wrapper/beatmap.ts';
import { BaseSlider } from '../../core/abstract/baseSlider.ts';
import { sortObjectFn } from '../../helpers/sort.ts';
import { ExecutionTime } from '../../shared/constants.ts';
import { toV3Beatmap } from '../toV3/beatmap.ts';

function tag(name: string): string[] {
   return ['convert', 'toV4Beatmap', name];
}

export function toV4Beatmap(data: IWrapBeatmap, fromVersion: number): IWrapBeatmap {
   logger.tWarn(
      tag('main'),
      'As v4 is similar to v3, the conversion will use v3 convertor alongside.',
   );
   toV3Beatmap(data, fromVersion);
   data.version = 4;

   const objects = [
      data.arcs,
      data.bombNotes,
      data.chains,
      data.colorNotes,
      data.obstacles,
      data.waypoints,
   ]
      .flat()
      .sort(sortObjectFn);

   if (data.rotationEvents.length) {
      const rotations = [...data.rotationEvents]
         .sort((a, b) => a.executionTime - b.executionTime)
         .sort(sortObjectFn);

      let calculatedRotations = 0;
      for (const r of rotations) {
         calculatedRotations += r.rotation;
      }

      // tail rotation is not required to be calculated as it is not previously used
      for (let i = objects.length - 1; i >= 0; i--) {
         const obj = objects[i];
         let evt = rotations.at(-1);
         while (evt && evt.time > obj.time) {
            rotations.pop();
            calculatedRotations -= evt.rotation;
            evt = rotations.at(-1);
         }
         if (!evt) break;
         if (evt.time === obj.time && evt.executionTime === ExecutionTime.EARLY) {
            obj.laneRotation = calculatedRotations % 360;
            if (obj instanceof BaseSlider) {
               obj.tailLaneRotation = obj.laneRotation;
            }
            continue;
         }

         while (evt && evt.time >= obj.time) {
            rotations.pop();
            calculatedRotations -= evt.rotation;
            evt = rotations.at(-1);
         }
         if (!evt) break;
         obj.laneRotation = calculatedRotations % 360;
         if (obj instanceof BaseSlider) {
            obj.tailLaneRotation = obj.laneRotation;
         }
      }

      data.rotationEvents = [];
   }

   for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (typeof obj.customData.worldRotation === 'number') {
         obj.laneRotation = obj.customData.worldRotation;
         if (obj instanceof BaseSlider) {
            obj.tailLaneRotation = obj.customData.worldRotation;
         }
         delete obj.customData.worldRotation;
      }
   }

   return data;
}
