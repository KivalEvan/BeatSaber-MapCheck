import logger from '../../logger.ts';
import { BPMInfo as V2AudioData } from '../../beatmap/v2/bpmInfo.ts';
import { AudioData as V4AudioData } from '../../beatmap/v4/audioData.ts';
import type { IWrapAudio } from '../../types/beatmap/wrapper/audioData.ts';

function tag(name: string): string[] {
   return ['convert', 'toV4Audio', name];
}

export function toV4Audio(data: IWrapAudio): V4AudioData {
   logger.tWarn(tag('main'), 'Converting to beatmap v4 may lose certain data!');

   let template = new V4AudioData();
   switch (true) {
      case data instanceof V2AudioData:
         template = new V4AudioData(data);
         break;
      case data instanceof V4AudioData:
         template = new V4AudioData(data);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }
   template.filename = data.filename;

   return template;
}
