import { round } from '../../utils/math.ts';
import type { ICleanOptions } from '../../types/beatmap/shared/clean.ts';
import type { IInfo } from '../../types/beatmap/v2/info.ts';
import type { IDifficulty } from '../../types/beatmap/v2/difficulty.ts';
import { deepClean, purgeZeros } from '../shared/clean.ts';

export function cleanDifficulty(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any> | IDifficulty,
   options: ICleanOptions,
) {
   for (let i1 = 0; i1 < data._notes!.length; i1++) {
      const o1 = data._notes[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
      }
      deepClean(o1._customData!, `difficulty._notes[${i1}]._customData`, options);
      if (!Object.keys(o1._customData!).length) {
         delete o1._customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < data._obstacles!.length; i1++) {
      const o1 = data._obstacles[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
         o1._duration = round(o1._duration, options.floatTrim);
      }
      deepClean(o1._customData!, `difficulty._obstacles[${i1}]._customData`, options);
      if (!Object.keys(o1._customData!).length) {
         delete o1._customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < data._sliders!.length; i1++) {
      const o1 = data._sliders[i1];
      if (options.floatTrim) {
         o1._headTime = round(o1._headTime, options.floatTrim);
         o1._tailTime = round(o1._tailTime, options.floatTrim);
         o1._headControlPointLengthMultiplier = round(
            o1._headControlPointLengthMultiplier,
            options.floatTrim,
         );
         o1._tailControlPointLengthMultiplier = round(
            o1._tailControlPointLengthMultiplier,
            options.floatTrim,
         );
      }
      deepClean(o1._customData!, `difficulty._sliders[${i1}]._customData`, options);
      if (!Object.keys(o1._customData!).length) {
         delete o1._customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < data._waypoints!.length; i1++) {
      const o1 = data._waypoints[i1];
      if (options.floatTrim) {
         o1._time = round(o1._time, options.floatTrim);
      }
      deepClean(o1._customData!, `difficulty._waypoints[${i1}]._customData`, options);
      if (!Object.keys(o1._customData!).length) {
         delete o1._customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < data._events!.length; i1++) {
      const o1 = data._events[i1];
      if (options.floatTrim && o1._type !== 100) {
         o1._time = round(o1._time, options.floatTrim);
         o1._floatValue = round(o1._floatValue, options.floatTrim);
      }
      deepClean(o1._customData!, `difficulty._events[${i1}]._customData`, options);
      if (!Object.keys(o1._customData!).length) {
         delete o1._customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   deepClean(data._customData!, 'difficulty._customData', options);
   if (!Object.keys(data._customData!).length) {
      delete data._customData;
   }
}

export function cleanInfo(
   // deno-lint-ignore no-explicit-any
   data: Record<string, any> | IInfo,
   options: ICleanOptions,
) {
   if (options.floatTrim) {
      data._beatsPerMinute = round(data._beatsPerMinute, options.floatTrim);
      data._previewDuration = round(data._previewDuration, options.floatTrim);
      data._previewStartTime = round(data._previewStartTime, options.floatTrim);
      data._shuffle = round(data._shuffle, options.floatTrim);
      data._shufflePeriod = round(data._shufflePeriod, options.floatTrim);
      data._songTimeOffset = round(data._songTimeOffset, options.floatTrim);
   }

   if (options.stringTrim) {
      data._levelAuthorName = data._levelAuthorName.trim();
      data._songAuthorName = data._songAuthorName.trim();
      data._songName = data._songName.trim();
      data._songSubName = data._songSubName.trim();
   }

   for (let it = 0; it < data._colorSchemes!.length; it++) {
      const cs = data._colorSchemes[it];
      deepClean(cs.colorScheme, `info._colorSchemes[${it}].colorScheme`, options);
   }

   for (let i1 = 0; i1 < data._difficultyBeatmapSets!.length; i1++) {
      const set = data._difficultyBeatmapSets[i1];
      for (let i2 = 0; i2 < set._difficultyBeatmaps!.length; i2++) {
         const diff = set._difficultyBeatmaps[i2];
         if (options.floatTrim) {
            diff._noteJumpMovementSpeed = round(diff._noteJumpMovementSpeed, options.floatTrim);
            diff._noteJumpStartBeatOffset = round(diff._noteJumpStartBeatOffset, options.floatTrim);
         }
         deepClean(
            diff._customData!,
            `info._difficultyBeatmapSets[${i1}]._difficultyBeatmaps[${i2}]._customData`,
            options,
         );
         if (!Object.keys(diff._customData!).length) {
            delete diff._customData;
         }
      }
      if (set._customData) {
         deepClean(set._customData!, `info._difficultyBeatmapSets[${i1}]._customData`, options);
         if (!Object.keys(set._customData!).length) {
            delete set._customData;
         }
      }
   }

   deepClean(data._customData!, 'info._customData', options);
   if (!Object.keys(data._customData!).length) {
      delete data._customData;
   }
}
