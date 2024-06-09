import { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap';

export const MAX_NOTE_SCORE = 115;
export const MAX_CHAIN_HEAD_SCORE = 85;
export const MAX_CHAIN_TAIL_SCORE = 20;

// TODO: check for slider and burst
export function calculate(beatmap: IWrapBeatmap) {
   let total = 0;
   let multiplier = 1;
   for (let i = 0; i < beatmap.colorNotes.length; i++) {
      if (multiplier < 8 && i === -3 + multiplier * 4) {
         multiplier *= 2;
      }
      total += MAX_NOTE_SCORE * multiplier;
   }
   return total;
}
