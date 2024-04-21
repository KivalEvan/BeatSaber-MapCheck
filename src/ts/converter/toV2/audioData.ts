import logger from '../../logger.ts';
import { BPMInfo as V2AudioData } from '../../beatmap/v2/bpmInfo.ts';
import { AudioData as V4AudioData } from '../../beatmap/v4/audioData.ts';
import type { IWrapAudio } from '../../types/beatmap/wrapper/audioData.ts';

function tag(name: string): string[] {
   return ['convert', 'toV2Audio', name];
}

export function toV2Audio(data: IWrapAudio): V2AudioData {
   logger.tWarn(tag('main'), 'Converting to beatmap v2 may lose certain data!');

   let template = new V2AudioData();
   switch (true) {
      case data instanceof V2AudioData:
         template = new V2AudioData(data);
         break;
      case data instanceof V4AudioData:
         template = new V2AudioData(data);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }
   template.filename = data.filename;

   return template;
}
