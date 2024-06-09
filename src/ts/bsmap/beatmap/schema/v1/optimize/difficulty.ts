import { round } from '../../../../utils/math.ts';
import type { IOptimizeOptions } from '../../../../types/beatmap/options/optimize.ts';
import type { IDifficulty } from '../../../../types/beatmap/v1/difficulty.ts';

export function optimizeDifficulty(data: IDifficulty, options: IOptimizeOptions) {
   for (let i1 = 0; i1 < data._notes.length; i1++) {
      const o1 = data._notes[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
      }
   }
   for (let i1 = 0; i1 < data._obstacles.length; i1++) {
      const o1 = data._obstacles[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
         o1._duration = round(o1._duration, options.floatTrim);
      }
   }
   for (let i1 = 0; i1 < data._events.length; i1++) {
      const o1 = data._events[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
      }
   }
}
