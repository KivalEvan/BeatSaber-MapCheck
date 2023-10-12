import { round } from '../../utils/math';
import { ICleanOptions } from '../../types/beatmap/shared/clean';
import { IInfo } from '../../types/beatmap/v1/info';
import { IDifficulty } from '../../types/beatmap/v1/difficulty';

export function cleanDifficulty(data: IDifficulty, options: ICleanOptions) {
   for (const i1 in data._notes) {
      const o1 = data._notes[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
      }
   }
   for (const i1 in data._obstacles) {
      const o1 = data._obstacles[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
         o1._duration = round(o1._duration, options.floatTrim);
      }
   }
   for (const i1 in data._events) {
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
