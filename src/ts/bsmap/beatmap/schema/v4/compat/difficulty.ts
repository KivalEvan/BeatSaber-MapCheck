import type { IWrapBeatmap } from '../../../../types/beatmap/wrapper/beatmap.ts';
import type { ICompatibilityOptions } from '../../../../types/beatmap/options/compatibility.ts';
import {
   hasMappingExtensionsBombNote,
   hasMappingExtensionsNote,
   hasMappingExtensionsObstacle,
} from '../../../helpers/modded/has.ts';
import logger from '../../../../logger.ts';
import { tag } from './_common.ts';
import { hasMappingExtensionsArc } from '../../../helpers/modded/has.ts';
import { hasMappingExtensionsChain } from '../../../helpers/modded/has.ts';

export function compatDifficulty(bm: IWrapBeatmap, options: ICompatibilityOptions) {
   const hasME =
      bm.colorNotes.some(hasMappingExtensionsNote) ||
      bm.bombNotes.some(hasMappingExtensionsBombNote) ||
      bm.arcs.some(hasMappingExtensionsArc) ||
      bm.chains.some(hasMappingExtensionsChain) ||
      bm.obstacles.some(hasMappingExtensionsObstacle);

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
