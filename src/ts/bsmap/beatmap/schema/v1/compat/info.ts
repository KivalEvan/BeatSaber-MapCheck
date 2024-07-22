import logger from '../../../../logger.ts';
import type { ICompatibilityOptions } from '../../../../types/beatmap/options/compatibility.ts';
import type { IWrapInfo } from '../../../../types/beatmap/wrapper/info.ts';
import { tag } from './_common.ts';

export function compatInfo(info: IWrapInfo, options: ICompatibilityOptions) {
   const hasIncompat =
      info.audio.shufflePeriod !== 0.5 || info.audio.shuffle !== 0 || info.audio.audioOffset !== 0;
   if (hasIncompat) {
      if (options.throwOn.incompatibleObject) {
         throw new Error('Info is not compatible with v4');
      } else {
         logger.tWarn(
            tag('compatInfo'),
            'Info is not compatible with v4, certain data may be lost!',
         );
      }
   }
}
