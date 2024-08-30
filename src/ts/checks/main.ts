import AnalysisComponents from './components';
import LoadedData from '../loadedData';
import { IToolOutput } from '../types/checks/check';
import { IBeatmapItem, ITool } from '../types';
import { getLastInteractiveTime, logger, NoteJumpSpeed, TimeProcessor } from 'bsmap';
import * as types from 'bsmap/types';

function tag(name: string) {
   return ['analyzer', name];
}

const toolListInput: ReadonlyArray<ITool> = AnalysisComponents.getAll().sort(
   (a, b) => a.order.input - b.order.input,
);

const toolListOutput: ReadonlyArray<ITool> = [...toolListInput].sort(
   (a, b) => a.order.output - b.order.output,
);

function init(): void {
   LoadedData.analysis = {
      general: {
         output: [],
      },
      beatmap: [],
   };
}

export function checkGeneral(): IToolOutput[] {
   const mapInfo = LoadedData.beatmapInfo;
   if (!mapInfo) {
      logger.tError(tag('runGeneral'), 'Could not analyse, missing map info');
      return [];
   }

   if (!LoadedData.analysis) {
      init();
   }

   const analysisExist = LoadedData.analysis?.general;

   logger.tInfo(tag('runGeneral'), `Analysing general`);
   const collections: IToolOutput[] = [];
   toolListOutput
      .filter((tool) => tool.type === 'general')
      .forEach((tool) => {
         if (tool.input.enabled) {
            try {
               const results = tool.run({
                  audioDuration: LoadedData.duration ?? null,
                  mapDuration: 0,
                  beatmap: null as unknown as IBeatmapItem,
                  info: mapInfo,
               });
               collections.push(...results);
            } catch (err) {
               logger.tError(tag('runGeneral'), err);
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
): IToolOutput[] {
   const mapInfo = LoadedData.beatmapInfo;
   if (!mapInfo) {
      logger.tError(tag('runDifficulty'), 'Could not analyse, missing map info');
      return [];
   }

   if (!LoadedData.analysis) {
      init();
   }

   const beatmap = LoadedData.beatmaps?.find(
      (bm) =>
         bm.settings.characteristic === characteristic && bm.settings.difficulty === difficulty,
   );
   if (!beatmap) {
      logger.tError(tag('runDifficulty'), 'Could not analyse, missing map data');
      return [];
   }

   const analysisExist = LoadedData.analysis?.beatmap.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );

   const njs = NoteJumpSpeed.create(
      beatmap.timeProcessor.bpm,
      beatmap.settings.njs || NoteJumpSpeed.FallbackNJS[beatmap.settings.difficulty],
      beatmap.settings.njsOffset,
   );

   logger.tInfo(tag('runDifficulty'), `Analysing ${characteristic} ${difficulty}`);
   const collections: IToolOutput[] = [];
   toolListOutput
      .filter((tool) => tool.type !== 'general')
      .forEach((tool) => {
         if (tool.input.enabled) {
            try {
               const results = tool.run({
                  audioDuration: LoadedData.duration ?? null,
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

   if (analysisExist) {
      analysisExist.output = collections;
   } else {
      LoadedData.analysis?.beatmap.push({
         characteristic: characteristic,
         difficulty: difficulty,
         output: collections,
      });
   }

   return collections;
}

function adjustTime(bpm: TimeProcessor): void {
   const toolList = AnalysisComponents.getDifficulty().sort(
      (a, b) => a.order.output - b.order.output,
   );
   toolList.forEach((tool) => {
      if (tool.input.adjustTime) {
         tool.input.adjustTime(bpm);
      }
   });
}

function applyAll(): void {
   LoadedData.beatmaps?.forEach((bm) =>
      checkDifficulty(bm.settings.characteristic, bm.settings.difficulty),
   );
}

export default {
   toolListInput,
   runGeneral: checkGeneral,
   runDifficulty: checkDifficulty,
   adjustTime,
   applyAll,
};
