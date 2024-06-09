import { round } from '../../../../utils/math.ts';
import type { IOptimizeOptions } from '../../../../types/beatmap/options/optimize.ts';
import type { IInfo } from '../../../../types/beatmap/v1/info.ts';

export function optimizeInfo(data: IInfo, options: IOptimizeOptions) {
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
