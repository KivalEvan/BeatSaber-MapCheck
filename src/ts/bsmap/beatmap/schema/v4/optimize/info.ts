import { round } from '../../../../utils/math.ts';
import type { IOptimizeOptions } from '../../../../types/beatmap/options/optimize.ts';
import type { IInfo } from '../../../../types/beatmap/v4/info.ts';
import { deepClean } from '../../../helpers/optimize.ts';

export function optimizeInfo(data: IInfo, options: IOptimizeOptions) {
   if (options.floatTrim) {
      data.audio.bpm = round(data.audio.bpm, options.floatTrim);
      data.audio.previewDuration = round(data.audio.previewDuration, options.floatTrim);
      data.audio.previewStartTime = round(data.audio.previewStartTime, options.floatTrim);
      data.audio.songDuration = round(data.audio.songDuration, options.floatTrim);
   }

   if (options.stringTrim) {
      data.song.author = data.song.author.trim();
      data.song.title = data.song.title.trim();
      data.song.subTitle = data.song.subTitle.trim();
   }

   for (let i = 0; i < data.difficultyBeatmaps!.length; i++) {
      const diff = data.difficultyBeatmaps[i];
      if (options.floatTrim) {
         diff.noteJumpMovementSpeed = round(diff.noteJumpMovementSpeed, options.floatTrim);
         diff.noteJumpStartBeatOffset = round(diff.noteJumpStartBeatOffset, options.floatTrim);
      }
      if (options.stringTrim) {
         diff.beatmapAuthors.lighters = diff.beatmapAuthors.lighters.map((s) => s.trim());
         diff.beatmapAuthors.mappers = diff.beatmapAuthors.mappers.map((s) => s.trim());
      }

      deepClean(diff.customData!, `info.difficultyBeatmaps[${i}].customData`, options);
      if (!Object.keys(diff.customData!).length) {
         delete diff.customData;
      }
   }

   deepClean(data.customData!, `info.customData`, options);
   if (!Object.keys(data.customData!).length) {
      delete data.customData;
   }
}
