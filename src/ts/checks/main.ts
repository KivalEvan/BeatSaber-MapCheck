import { cachedKeyedComponents, getComponentsAll, getComponentsDifficulty } from './components';
export * from './presets';
import { State } from '../state';
import { IToolOutput } from '../types/checks/check';
import { IBeatmapContainer, ITool } from '../types';
import { getLastInteractiveTime, logger, NoteJumpSpeed, TimeProcessor } from 'bsmap';
import * as types from 'bsmap/types';
import { InputParamsList as PresetParamsList } from './presets/_type';
import { UISelection } from '../ui/selection';
import { presets } from './presets';
import { deepCopy } from 'bsmap/utils';

function tag(name: string) {
   return ['checks', name];
}

const toolListInput: ReadonlyArray<ITool> = getComponentsAll().sort(
   (a, b) => a.order.input - b.order.input,
);

const toolListOutput: ReadonlyArray<ITool> = [...toolListInput].sort(
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

export function updateChecksPreset(preset: PresetParamsList): void {
   const characteristic = UISelection.getSelectedCharacteristic();
   const difficulty = UISelection.getSelectedDifficulty();
   const beatmap = State.data.beatmaps?.find(
      (bm) => bm.info.characteristic === characteristic && bm.info.difficulty === difficulty,
   );
   for (const k in preset) {
      const key = k as keyof PresetParamsList;
      cachedKeyedComponents[key].input.params =
         preset[key].params ??
         deepCopy(presets.Default[key].params) ??
         cachedKeyedComponents[key].input.params;
      cachedKeyedComponents[key].input.update?.(beatmap?.timeProcessor);
   }
}

export function checkGeneral(): IToolOutput[] {
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
   const collections: IToolOutput[] = [];
   toolListOutput
      .filter((tool) => tool.type === 'general')
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
): IToolOutput[] {
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

   const analysisExist = State.data.analysis?.beatmap.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );

   logger.tInfo(tag('checkDifficulty'), `Analysing ${characteristic} ${difficulty}`);
   const collections: IToolOutput[] = [];
   toolListOutput
      .filter((tool) => tool.type !== 'general')
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

   if (analysisExist) {
      analysisExist.output = collections;
   } else {
      State.data.analysis?.beatmap.push({
         characteristic: characteristic,
         difficulty: difficulty,
         output: collections,
      });
   }

   return collections;
}

function adjustTime(bpm: TimeProcessor): void {
   const toolList = getComponentsDifficulty().sort((a, b) => a.order.output - b.order.output);
   toolList.forEach((tool) => {
      if (tool.input.adjustTime) {
         tool.input.adjustTime(bpm);
      }
   });
}

function applyAll(): void {
   State.data.beatmaps?.forEach((bm) =>
      checkDifficulty(bm.info.characteristic, bm.info.difficulty),
   );
}

export default {
   toolListInput,
   runGeneral: checkGeneral,
   runDifficulty: checkDifficulty,
   adjustTime,
   applyAll,
};
