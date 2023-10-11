import { IDifficulty } from '../../types/beatmap/v1/difficulty';
import { Difficulty } from './difficulty';
import { IInfo } from '../../types/beatmap/v1/info';
import { Info } from './info';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyCheck, InfoCheck } from './dataCheck';
import logger from '../../logger';
import { IDataCheckOption } from '../../types/beatmap/shared/dataCheck';

function tag(name: string): string[] {
   return ['v1', 'parse', name];
}

export function parseDifficulty(
   data: Partial<IDifficulty>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Difficulty {
   logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v1.x.x');
   if (!data._version?.startsWith('1')) {
      logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
      data._version = '1.5.0';
   }
   if (checkData.enabled) {
      deepCheck(data, DifficultyCheck, 'difficulty', data._version, checkData.throwError);
   }

   return new Difficulty(data);
}

export function parseInfo(
   data: Partial<IInfo>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Info {
   logger.tInfo(tag('info'), 'Parsing beatmap info v1.x.x');
   if (checkData.enabled) {
      deepCheck(data, InfoCheck, 'info', '1.0.0', checkData.throwError);
   }

   return new Info(data);
}
