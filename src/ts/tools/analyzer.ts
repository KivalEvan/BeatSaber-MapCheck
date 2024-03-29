import AnalysisComponents from './components';
import SavedData from '../savedData';
import { BeatPerMinute } from '../beatmap/shared/bpm';
import { NoteJumpSpeed } from '../beatmap/shared/njs';
import { CharacteristicName, DifficultyName } from '../types/beatmap/shared/mod';
import { IBeatmapSettings } from '../types/mapcheck/tools/tool';
import { Tool } from '../types/mapcheck';
import logger from '../logger';

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
   SavedData.analysis = {
      general: {
         html: null,
      },
      map: [],
   };
}

function runGeneral(): void {
   const mapInfo = SavedData.beatmapInfo;
   if (!mapInfo) {
      logger.tError(tag('runGeneral'), 'Could not analyse, missing map info');
      return;
   }

   if (!SavedData.analysis) {
      init();
   }

   const analysisExist = SavedData.analysis?.general;

   const bpm = BeatPerMinute.create(mapInfo.audio.bpm);
   const njs = NoteJumpSpeed.create(bpm);

   const mapSettings: IBeatmapSettings = {
      bpm: bpm,
      njs: njs,
      audioDuration: SavedData.duration ?? null,
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
   const mapInfo = SavedData.beatmapInfo;
   if (!mapInfo) {
      logger.tError(tag('runDifficulty'), 'Could not analyse, missing map info');
      return;
   }

   if (!SavedData.analysis) {
      init();
   }

   const beatmapDifficulty = SavedData.beatmapDifficulty?.find(
      (set) => set.characteristic === characteristic && set.difficulty === difficulty,
   );
   if (!beatmapDifficulty) {
      logger.tError(tag('runDifficulty'), 'Could not analyse, missing map data');
      return;
   }

   const analysisExist = SavedData.analysis?.map.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );

   const njs = NoteJumpSpeed.create(
      beatmapDifficulty.bpm,
      beatmapDifficulty.info.njs || NoteJumpSpeed.FallbackNJS[beatmapDifficulty.difficulty],
      beatmapDifficulty.info.njsOffset,
   );

   const mapSettings: IBeatmapSettings = {
      bpm: beatmapDifficulty.bpm,
      njs: njs,
      audioDuration: SavedData.duration ?? null,
      mapDuration: beatmapDifficulty.bpm.toRealTime(
         beatmapDifficulty.data.getLastInteractiveTime(),
      ),
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
                  difficulty: beatmapDifficulty,
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
      SavedData.analysis?.map.push({
         characteristic: characteristic,
         difficulty: difficulty,
         html: htmlArr,
      });
   }
}

function adjustTime(bpm: BeatPerMinute): void {
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
   SavedData.beatmapDifficulty?.forEach((set) => runDifficulty(set.characteristic, set.difficulty));
}

export default {
   toolListInput,
   runGeneral,
   runDifficulty,
   adjustTime,
   applyAll,
};
