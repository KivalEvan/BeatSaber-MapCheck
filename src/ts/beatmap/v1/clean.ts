import { round } from '../../utils/math.ts';
import type { ICleanOptions } from '../../types/beatmap/shared/clean.ts';
import type { IInfo } from '../../types/beatmap/v1/info.ts';
import type { IDifficulty } from '../../types/beatmap/v1/difficulty.ts';

export function cleanDifficulty(data: IDifficulty, options: ICleanOptions) {
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

export function cleanInfo(data: IInfo, options: ICleanOptions) {
   if (options.floatTrim) {
      data.previewDuration = round(data.previewDuration, options.floatTrim);
      data.previewStartTime = round(data.previewStartTime, options.floatTrim);
   }

   if (options.stringTrim) {
      data.authorName = data.authorName.trim();
      data.songName = data.songName.trim();
      data.songSubName = data.songSubName.trim();
   }
}
