import { Info } from './info';
import { deepCheck } from '../shared/dataCheck';
import logger from '../../logger';
import { IDataCheckOption } from '../../types/beatmap/shared/dataCheck';
import { shallowCopy } from '../../utils/misc';
import { AudioDataCheck, InfoDataCheck, LightshowDataCheck } from './dataCheck';
import { DifficultyDataCheck } from './dataCheck';
import { Difficulty } from './difficulty';
import { Lightshow } from './lightshow';
import { AudioData } from './audioData';

function tag(name: string): string[] {
   return ['v4', 'parse', name];
}

export function parseInfo(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Info {
   logger.tInfo(tag('info'), 'Parsing beatmap info v4.x.x');
   data = shallowCopy(data);
   if (!data.version?.startsWith('4')) {
      logger.tWarn(tag('info'), 'Unidentified beatmap version');
      data.version = '4.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, InfoDataCheck, 'info', data._version, checkData.throwError);
   }

   return Info.fromJSON(data);
}

export function parseDifficulty(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Difficulty {
   logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v4.x.x');
   data = shallowCopy(data);
   if (!data.version?.startsWith('4')) {
      logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
      data.version = '4.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, DifficultyDataCheck, 'difficulty', data.version, checkData.throwError);
   }

   return Difficulty.fromJSON(data);
}

export function parseLightshow(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Lightshow {
   logger.tInfo(tag('lightshow'), 'Parsing beatmap lightshow v4.x.x');
   data = shallowCopy(data);
   if (!data.version?.startsWith('4')) {
      logger.tWarn(tag('lightshow'), 'Unidentified beatmap version');
      data.version = '4.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, LightshowDataCheck, 'lightshow', data.version, checkData.throwError);
   }

   return Lightshow.fromJSON(data);
}

export function parseAudio(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): AudioData {
   logger.tInfo(tag('audio'), 'Parsing beatmap audio data v4.x.x');
   data = shallowCopy(data);
   if (!data._version?.startsWith('4')) {
      logger.tWarn(tag('audio'), 'Unidentified beatmap version');
      data._version = '4.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, AudioDataCheck, 'audio', data._version, checkData.throwError);
   }

   return AudioData.fromJSON(data);
}
