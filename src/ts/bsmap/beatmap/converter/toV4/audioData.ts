import logger from '../../../logger.ts';
import type { IWrapAudioData } from '../../../types/beatmap/wrapper/audioData.ts';

function tag(name: string): string[] {
   return ['convert', 'toV4Audio', name];
}

export function toV4Audio(data: IWrapAudioData, fromVersion: number): IWrapAudioData {
   logger.tWarn(tag('main'), 'Converting to beatmap v4 may lose certain data!');

   switch (fromVersion) {
      case 1:
      case 2:
      case 3:
      case 4:
         data.version = 4;
         break;
      default:
         logger.tWarn(
            tag('main'),
            'Unknown version: version not supported; misinput? Returning original data.',
         );
   }

   return data;
}
