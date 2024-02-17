import { Difficulty } from './difficulty';
import { Info } from './info';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyDataCheck, InfoDataCheck } from './dataCheck';
import logger from '../../logger';
import { IDataCheckOption } from '../../types/beatmap/shared/dataCheck';
import { shallowCopy } from '../../utils/misc';

function tag(name: string): string[] {
   return ['v1', 'parse', name];
}

export function parseDifficulty(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Difficulty {
   logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v1.x.x');
   shallowCopy(data);
   if (!data._version?.startsWith('1')) {
      logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
      data._version = '1.5.0';
   }
   if (checkData.enabled) {
      deepCheck(data, DifficultyDataCheck, 'difficulty', data._version, checkData.throwError);
   }

   return Difficulty.fromJSON(data);
}

export function parseInfo(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Info {
   logger.tInfo(tag('info'), 'Parsing beatmap info v1.x.x');
   if (checkData.enabled) {
      deepCheck(data, InfoDataCheck, 'info', '1.0.0', checkData.throwError);
   }

   return Info.fromJSON(data);
}
