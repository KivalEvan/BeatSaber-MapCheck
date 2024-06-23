import AnalysisComponents from './components';
import LoadedData from '../loadedData';
import { TimeProcessor } from '../bsmap/beatmap/helpers/timeProcessor';
import { NoteJumpSpeed } from '../bsmap/beatmap/helpers/njs';
import { CharacteristicName, DifficultyName } from '../bsmap/types/beatmap/shared/mod';
import { IToolOutput } from '../types/checks/check';
import { IBeatmapItem, ITool } from '../types';
import logger from '../bsmap/logger';
import { getLastInteractiveTime } from '../bsmap/beatmap/helpers/beatmap';
import { printResult, printResultTime } from '../ui/checks/output';

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
         html: null,
      },
      beatmap: [],
   };
}

function outputToHtml(output: IToolOutput): HTMLDivElement {
   switch (output.type) {
      case 'string':
         return printResult(output.label, output.value, output.symbol);
      case 'number':
         return printResult(output.label, output.value.join(', '), output.symbol);
      case 'time':
         return printResultTime(output.label, output.value, output.symbol);
      case 'html':
         const htmlContainer = document.createElement('div');
         output.value.forEach((h) => htmlContainer.appendChild(h));
         return htmlContainer;
      default:
         throw new Error('Unexpected result type');
   }
}

function checkGeneral(): void {
   const mapInfo = LoadedData.beatmapInfo;
   if (!mapInfo) {
      logger.tError(tag('runGeneral'), 'Could not analyse, missing map info');
      return;
   }

   if (!LoadedData.analysis) {
      init();
   }

   const analysisExist = LoadedData.analysis?.general;

   logger.tInfo(tag('runGeneral'), `Analysing general`);
   const htmlArr: HTMLElement[] = [];
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
               htmlArr.push(...results.map(outputToHtml));
            } catch (err) {
               logger.tError(tag('runGeneral'), err);
            }
         }
      });

   if (analysisExist) {
      analysisExist.html = htmlArr;
   }
}

function checkDifficulty(characteristic: CharacteristicName, difficulty: DifficultyName): void {
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

   const analysisExist = LoadedData.analysis?.beatmap.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );

   const njs = NoteJumpSpeed.create(
      beatmap.timeProcessor.bpm,
      beatmap.settings.njs || NoteJumpSpeed.FallbackNJS[beatmap.settings.difficulty],
      beatmap.settings.njsOffset,
   );

   logger.tInfo(tag('runDifficulty'), `Analysing ${characteristic} ${difficulty}`);
   const htmlArr: HTMLElement[] = [];
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
               htmlArr.push(...results.map(outputToHtml));
            } catch (err) {
               logger.tError(tag('runDifficulty'), err);
            }
         }
      });

   if (analysisExist) {
      analysisExist.html = htmlArr;
   } else {
      LoadedData.analysis?.beatmap.push({
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
