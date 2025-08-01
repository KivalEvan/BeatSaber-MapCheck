export * from './presets';
import { getAllComponents } from './components';
import { State } from '../state';
import { CheckType, ICheckOutput } from '../types/checks/check';
import { IBeatmapContainer, ICheck } from '../types';
import { getLastInteractiveTime, logger } from 'bsmap';
import * as types from 'bsmap/types';

function tag(name: string) {
   return ['checks', name];
}

const toolListOutput: ReadonlyArray<ICheck> = getAllComponents().sort(
   (a, b) => a.order.output - b.order.output,
);

function init(): void {
   State.data.analysis = {
      general: {
         output: [],
      },
      beatmap: [],
   };
}

export function checkGeneral(): ICheckOutput[] {
   const mapInfo = State.data.info;
   if (!mapInfo) {
      logger.tError(tag('checkGeneral'), 'Could not analyse, missing map info');
      return [];
   }

   if (!State.data.analysis) {
      init();
   }

   const analysisExist = State.data.analysis?.general;

   logger.tInfo(tag('checkGeneral'), `Analysing general`);
   const collections: ICheckOutput[] = [];
   toolListOutput
      .filter((tool) => tool.type === CheckType.GENERAL)
      .forEach((tool) => {
         if (tool.input.params.enabled) {
            try {
               const results = tool.run({
                  audioDuration: State.data.duration ?? null,
                  mapDuration: 0,
                  beatmap: null as unknown as IBeatmapContainer,
                  info: mapInfo,
               });
               collections.push(...results);
            } catch (err) {
               logger.tError(tag('checkGeneral'), err);
            }
         }
      });

   if (analysisExist) {
      analysisExist.output = collections;
   }

   return collections;
}

export function checkDifficulty(
   characteristic: types.CharacteristicName,
   difficulty: types.DifficultyName,
): ICheckOutput[] {
   const mapInfo = State.data.info;
   if (!mapInfo) {
      logger.tError(tag('checkDifficulty'), 'Could not analyse, missing map info');
      return [];
   }

   if (!State.data.analysis) {
      init();
   }

   const beatmap = State.data.beatmaps?.find(
      (bm) => bm.info.characteristic === characteristic && bm.info.difficulty === difficulty,
   );
   if (!beatmap) {
      logger.tError(tag('checkDifficulty'), 'Could not analyse, missing map data');
      return [];
   }

   logger.tInfo(tag('checkDifficulty'), `Analysing ${characteristic} ${difficulty}`);
   const collections: ICheckOutput[] = [];
   toolListOutput
      .filter((tool) => tool.type !== CheckType.GENERAL)
      .forEach((tool) => {
         if (tool.input.params.enabled) {
            try {
               const results = tool.run({
                  audioDuration: State.data.duration ?? null,
                  mapDuration: beatmap.timeProcessor.toRealTime(
                     getLastInteractiveTime(beatmap.data),
                  ),
                  beatmap: beatmap,
                  info: mapInfo,
               });
               collections.push(...results);
            } catch (err) {
               logger.tError(tag('runDifficulty'), err);
            }
         }
      });

   const analysisBeatmap = State.data.analysis?.beatmap.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );
   if (analysisBeatmap) {
      analysisBeatmap.output = collections;
   } else {
      State.data.analysis?.beatmap.push({
         characteristic: characteristic,
         difficulty: difficulty,
         output: collections,
      });
   }

   return collections;
}

export function checkAllDifficulty(): void {
   State.data.beatmaps?.forEach((bm) =>
      checkDifficulty(bm.info.characteristic, bm.info.difficulty),
   );
}
