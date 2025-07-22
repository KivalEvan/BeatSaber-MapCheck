import * as general from './general';
import * as notes from './notes';
import * as obstacles from './obstacles';
import * as events from './events';
import * as others from './others';
import { ICheck } from '../types/checks/check';
import { InputParamsList as PresetParamsList } from './presets/_type';
import { UISelection } from '../ui/selection';
import { presets } from './presets';
import { deepCopy } from 'bsmap/utils';
import { State } from '../state';
import { TimeProcessor } from 'bsmap';

export function getAllComponents(): ICheck[] {
   return [
      ...Object.values(notes),
      ...Object.values(obstacles),
      ...Object.values(events),
      ...Object.values(others),
      ...Object.values(general),
   ];
}

export const cachedKeyedComponents = {
   ...notes,
   ...obstacles,
   ...events,
   ...others,
   ...general,
} as const;

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

export function applyBpmToComponents(bpm: TimeProcessor): void {
   for (const key in cachedKeyedComponents) {
      const tool = cachedKeyedComponents[key as keyof typeof cachedKeyedComponents];
      if (tool.input.adjustTime) {
         tool.input.adjustTime(bpm);
      }
   }
}
