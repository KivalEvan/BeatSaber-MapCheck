import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { Difficulty } from './difficulty';
import { IInfo } from '../../types/beatmap/v2/info';
import { Info } from './info';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyCheck, InfoCheck } from './dataCheck';
import { DifficultyRanking } from '../shared/difficulty';
import logger from '../../logger';
import { IDataCheckOption } from '../../types/beatmap/shared/dataCheck';
import { compareVersion } from '../shared/version';

function tag(name: string): string[] {
   return ['v2', 'parse', name];
}

export function parseDifficulty(
   data: Partial<IDifficulty>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Difficulty {
   logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v2.x.x');
   if (!data._version?.startsWith('2')) {
      logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
      data._version = '2.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, DifficultyCheck, 'difficulty', data._version, checkData.throwError);
   }

   if (compareVersion(data._version, '2.5.0') === 'old') {
      data._events?.forEach((e) => (e._floatValue = 1));
   }

   return new Difficulty(data);
}

export function parseInfo(
   data: Partial<IInfo>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Info {
   logger.tInfo(tag('info'), 'Parsing beatmap info v2.x.x');
   if (!data._version?.startsWith('2')) {
      logger.tWarn(tag('info'), 'Unidentified beatmap version');
   }
   // FIXME: temporary fix from my own mistake, remove when 2.2.0 exist
   data._version = '2.0.0';
   if (checkData.enabled) {
      deepCheck(data, InfoCheck, 'info', data._version, checkData.throwError);
   }

   data._difficultyBeatmapSets?.forEach((set) => {
      let num = 0;
      set._difficultyBeatmaps?.forEach((a) => {
         if (typeof a._difficultyRank === 'number') {
            if (a._difficultyRank - num <= 0) {
               logger.tWarn(tag('info'), a._difficulty + ' is unordered');
            }
         } else if (typeof a._difficulty === 'string') {
            a._difficultyRank = DifficultyRanking[a._difficulty];
            if (!a._difficultyRank) {
               a._difficulty = 'Easy';
               a._difficultyRank = 1;
            }
         } else {
            a._difficulty = 'Easy';
            a._difficultyRank = 1;
         }
         if (DifficultyRanking[a._difficulty!] !== a._difficultyRank) {
            logger.tError(tag('info'), a._difficulty + ' has invalid rank');
         }
         num = a._difficultyRank;
         if (
            typeof a._customData?._editorOffset === 'number' &&
            a._customData._editorOffset === 0
         ) {
            delete a._customData._editorOffset;
         }
         if (
            typeof a._customData?._editorOldOffset === 'number' &&
            a._customData._editorOldOffset === 0
         ) {
            delete a._customData._editorOldOffset;
         }
      });
   });

   return new Info(data);
}
