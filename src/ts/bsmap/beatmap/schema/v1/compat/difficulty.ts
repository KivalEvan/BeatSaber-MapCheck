import type { IWrapBeatmap } from '../../../../types/beatmap/wrapper/beatmap.ts';
import type { ICompatibilityOptions } from '../../../../types/beatmap/options/compatibility.ts';
import logger from '../../../../logger.ts';
import { tag } from './_common.ts';
import {
   hasMappingExtensionsBombNote,
   hasMappingExtensionsNote,
   hasMappingExtensionsObstacleV2,
   hasMappingExtensionsRotationV2,
} from '../../../helpers/modded/has.ts';

export function compatDifficulty(bm: IWrapBeatmap, options: ICompatibilityOptions) {
   const hasIncompat =
      !!bm.arcs.length ||
      !!bm.chains.length ||
      !!bm.waypoints.length ||
      !!bm.bpmEvents.length ||
      !!bm.lightColorEventBoxGroups.length ||
      !!bm.lightRotationEventBoxGroups.length ||
      !!bm.lightTranslationEventBoxGroups.length ||
      !!bm.fxEventBoxGroups.length;

   if (hasIncompat) {
      if (options.throwOn.incompatibleObject) {
         throw new Error('Beatmap is not compatible with v1');
      } else {
         logger.tWarn(
            tag('compatDifficulty'),
            'Beatmap is not compatible with v1, certain data may be lost!',
         );
      }
   }

   const hasME =
      bm.colorNotes.some(hasMappingExtensionsNote) ||
      bm.bombNotes.some(hasMappingExtensionsBombNote) ||
      bm.obstacles.some(hasMappingExtensionsObstacleV2) ||
      bm.rotationEvents.some(hasMappingExtensionsRotationV2);

   if (hasME) {
      if (options.throwOn.mappingExtensions) {
         throw new Error('Beatmap contain Mapping Extensions value');
      } else {
         logger.tWarn(
            tag('compatDifficulty'),
            'Beatmap contain Mapping Extensions value and require Mapping Extensions mod to function!',
         );
      }
   }
}
