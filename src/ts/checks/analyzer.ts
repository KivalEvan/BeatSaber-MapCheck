import AnalysisComponents from './components';
import LoadedData from '../loadedData';
import { TimeProcessor } from '../bsmap/beatmap/helpers/timeProcessor';
import { NoteJumpSpeed } from '../bsmap/beatmap/helpers/njs';
import { CharacteristicName, DifficultyName } from '../bsmap/types/beatmap/shared/mod';
import { IBeatmapSettings } from '../types/checks/check';
import { Tool } from '../types';
import logger from '../bsmap/logger';
import { getLastInteractiveTime } from '../bsmap/beatmap/helpers/beatmap';

function tag(name: string) {
   return ['analyzer', name];
}

const toolListInput: ReadonlyArray<Tool> = AnalysisComponents.getAll().sort(
   (a, b) => a.order.input - b.order.input,
);

const toolListOutput: ReadonlyArray<Tool> = [...toolListInput].sort(
   (a, b) => a.order.output - b.order.output,
);

function init(): void {
   LoadedData.analysis = {
      general: {
         html: null,
      },
      map: [],
   };
}

function runGeneral(): void {
   const mapInfo = LoadedData.beatmapInfo;
   if (!mapInfo) {
      logger.tError(tag('runGeneral'), 'Could not analyse, missing map info');
      return;
   }

   if (!LoadedData.analysis) {
      init();
   }

   const analysisExist = LoadedData.analysis?.general;

   const timeProcessor = TimeProcessor.create(mapInfo.audio.bpm);
   const njs = NoteJumpSpeed.create(mapInfo.audio.bpm);

   const mapSettings: IBeatmapSettings = {
      timeProcessor: timeProcessor,
      njs: njs,
      audioDuration: LoadedData.duration ?? null,
      mapDuration: 0,
   };

   logger.tInfo(tag('runGeneral'), `Analysing general`);
   const htmlArr: HTMLElement[] = [];
   toolListOutput
      .filter((tool) => tool.type === 'general')
      .forEach((tool) => {
         if (tool.input.enabled) {
            try {
               tool.run({
                  settings: mapSettings,
                  info: mapInfo,
               });
               if (tool.output.html) {
                  htmlArr.push(tool.output.html);
               }
            } catch (err) {
               logger.tError(tag('runGeneral'), err);
            }
         }
      });

   if (analysisExist) {
      analysisExist.html = htmlArr;
   }
}

function runDifficulty(characteristic: CharacteristicName, difficulty: DifficultyName): void {
   const mapInfo = LoadedData.beatmapInfo;
   if (!mapInfo) {
      logger.tError(tag('runDifficulty'), 'Could not analyse, missing map info');
      return;
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
      return;
   }

   const analysisExist = LoadedData.analysis?.map.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );

   const njs = NoteJumpSpeed.create(
      beatmap.timeProcessor.bpm,
      beatmap.settings.njs || NoteJumpSpeed.FallbackNJS[beatmap.settings.difficulty],
      beatmap.settings.njsOffset,
   );

   const mapSettings: IBeatmapSettings = {
      timeProcessor: beatmap.timeProcessor,
      njs: njs,
      audioDuration: LoadedData.duration ?? null,
      mapDuration: beatmap.timeProcessor.toRealTime(getLastInteractiveTime(beatmap.data)),
   };

   logger.tInfo(tag('runDifficulty'), `Analysing ${characteristic} ${difficulty}`);
   const htmlArr: HTMLElement[] = [];
   toolListOutput
      .filter((tool) => tool.type !== 'general')
      .forEach((tool) => {
         if (tool.input.enabled) {
            try {
               tool.run({
                  settings: mapSettings,
                  beatmap: beatmap,
                  info: mapInfo,
               });
               if (tool.output.html) {
                  htmlArr.push(tool.output.html);
               }
            } catch (err) {
               logger.tError(tag('runDifficulty'), err);
            }
         }
      });

   if (analysisExist) {
      analysisExist.html = htmlArr;
   } else {
      LoadedData.analysis?.map.push({
         characteristic: characteristic,
         difficulty: difficulty,
         html: htmlArr,
      });
   }
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
      runDifficulty(bm.settings.characteristic, bm.settings.difficulty),
   );
}

export default {
   toolListInput,
   runGeneral,
   runDifficulty,
   adjustTime,
   applyAll,
};
