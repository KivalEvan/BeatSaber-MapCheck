import logger from '../../../../logger.ts';
import type { ICompatibilityOptions } from '../../../../types/beatmap/options/compatibility.ts';
import type { IWrapAudioData } from '../../../../types/beatmap/wrapper/audioData.ts';
import { tag } from './_common.ts';

export function compatAudioData(data: IWrapAudioData, options: ICompatibilityOptions) {
   const hasIncompat = !!data.lufsData.length;

   if (hasIncompat) {
      if (options.throwOn.incompatibleObject) {
         throw new Error('Audio data is not compatible with v2');
      } else {
         logger.tWarn(
            tag('compatAudioData'),
            'Audio data is not compatible with v2, certain data may be lost!',
         );
      }
   }
}
