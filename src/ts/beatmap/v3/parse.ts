import { IDifficulty } from '../../types/beatmap/v3/difficulty';
import { Difficulty } from './difficulty';
import { DifficultyCheck } from './dataCheck';
import { deepCheck } from '../shared/dataCheck';
import logger from '../../logger';
import { IDataCheckOption } from '../../types/beatmap/shared/dataCheck';

function tag(name: string): string[] {
   return ['v3', 'parse', name];
}

export function parseDifficulty(
   data: Partial<IDifficulty>,
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
      data.version = '3.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, DifficultyCheck, 'difficulty', data.version, checkData.throwError);
   }

   data.sliders?.forEach((e) => {
      e.mu ??= 0;
      e.tmu ??= 0;
   });
   data.basicBeatmapEvents?.forEach((e) => {
      e.f ??= 0;
   });
   data.burstSliders?.forEach((e) => {
      e.s ??= 0;
   });
   data.obstacles?.forEach((e) => {
      e.d ??= 0;
      e.w ??= 0;
      e.h ??= 0;
   });

   return new Difficulty(data);
}
