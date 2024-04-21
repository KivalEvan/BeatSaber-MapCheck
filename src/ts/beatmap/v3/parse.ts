import logger from '../../logger.ts';
import { Difficulty } from './difficulty.ts';
import { Lightshow } from './lightshow.ts';
import { DifficultyDataCheck, LightshowDataCheck } from './dataCheck.ts';
import { deepCheck } from '../shared/dataCheck.ts';
import type { IDataCheckOption } from '../../types/beatmap/shared/dataCheck.ts';

function tag(name: string): string[] {
   return ['v3', 'parse', name];
}

export function parseDifficulty(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Difficulty {
   logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v3.x.x');
   if (
      !(
         data.version === '3.0.0' ||
         data.version === '3.1.0' ||
         data.version === '3.2.0' ||
         data.version === '3.3.0'
      )
   ) {
      logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
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
   logger.tInfo(tag('lightshow'), 'Parsing beatmap lightshow v3.x.x');
   logger.tWarn(
      tag('lightshow'),
      'This beatmap does not have lightshow version and does not work in-game.',
   );
   if (checkData.enabled) {
      deepCheck(data, LightshowDataCheck, 'lightshow', data.version, checkData.throwError);
   }

   return Lightshow.fromJSON(data);
}
