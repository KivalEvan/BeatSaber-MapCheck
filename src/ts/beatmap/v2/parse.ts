import { Difficulty } from './difficulty';
import { IInfoSet } from '../../types/beatmap/v2/info';
import { Info } from './info';
import { deepCheck } from '../shared/dataCheck';
import { DifficultyDataCheck, InfoDataCheck } from './dataCheck';
import { DifficultyRanking } from '../shared/difficulty';
import logger from '../../logger';
import { IDataCheckOption } from '../../types/beatmap/shared/dataCheck';
import { compareVersion } from '../shared/version';
import { IEvent } from '../../types/beatmap/v2/event';
import { shallowCopy } from '../../utils/misc';

function tag(name: string): string[] {
   return ['v2', 'parse', name];
}

export function parseDifficulty(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Difficulty {
   logger.tInfo(tag('difficulty'), 'Parsing beatmap difficulty v2.x.x');
   data = shallowCopy(data);
   if (!data._version?.startsWith('2')) {
      logger.tWarn(tag('difficulty'), 'Unidentified beatmap version');
      data._version = '2.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, DifficultyDataCheck, 'difficulty', data._version, checkData.throwError);
   }

   data._customData = shallowCopy(data._customData || {});
   if (data._BPMChanges) data._customData_BPMChanges ||= data._BPMChanges;
   if (data._bpmChanges) data._customData_bpmChanges ||= data._bpmChanges;
   if (data._bookmarks) data._customData._bookmarks ||= data._bookmarks;
   if (data._customEvents) {
      data._customData._customEvents ||= data._customEvents;
   }
   if (data._time) data._customData._time ||= data._time;

   if (compareVersion(data._version, '2.5.0') === 'old') {
      data._events =
         data._events?.map((e: IEvent) => {
            e = shallowCopy(e);
            e._floatValue = 1;
            return e;
         }) || [];
   }

   return Difficulty.fromJSON(data);
}

export function parseInfo(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any>,
   checkData: IDataCheckOption = { enabled: true, throwError: true },
): Info {
   logger.tInfo(tag('info'), 'Parsing beatmap info v2.x.x');
   data = shallowCopy(data);
   if (!data._version?.startsWith('2')) {
      logger.tWarn(tag('info'), 'Unidentified beatmap version');
      data._version = '2.0.0';
   }
   if (checkData.enabled) {
      deepCheck(data, InfoDataCheck, 'info', data._version, checkData.throwError);
   }

   data._difficultyBeatmapSets =
      data._difficultyBeatmapSets?.map(shallowCopy).map((set: IInfoSet) => {
         set = shallowCopy(set);
         let num = 0;
         set._difficultyBeatmaps = set._difficultyBeatmaps?.map((diff) => {
            diff = shallowCopy(diff);
            if (typeof diff._difficultyRank === 'number') {
               if (diff._difficultyRank - num <= 0) {
                  logger.tWarn(tag('info'), diff._difficulty + ' is unordered');
               }
            } else if (typeof diff._difficulty === 'string') {
               diff._difficultyRank = DifficultyRanking[diff._difficulty];
               if (!diff._difficultyRank) {
                  diff._difficulty = 'Easy';
                  diff._difficultyRank = 1;
               }
            } else {
               diff._difficulty = 'Easy';
               diff._difficultyRank = 1;
            }
            if (DifficultyRanking[diff._difficulty!] !== diff._difficultyRank) {
               logger.tError(tag('info'), diff._difficulty + ' has invalid rank');
            }
            num = diff._difficultyRank;
            diff._customData = shallowCopy(diff._customData || {});
            if (
               typeof diff._customData?._editorOffset === 'number' &&
               diff._customData._editorOffset === 0
            ) {
               delete diff._customData._editorOffset;
            }
            if (
               typeof diff._customData?._editorOldOffset === 'number' &&
               diff._customData._editorOldOffset === 0
            ) {
               delete diff._customData._editorOldOffset;
            }
            return diff;
         });
         return set;
      }) || [];

   return Info.fromJSON(data);
}
