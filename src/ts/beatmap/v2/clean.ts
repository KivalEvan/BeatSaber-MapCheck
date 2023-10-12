import { round } from '../../utils/math';
import { ICleanOptions } from '../../types/beatmap/shared/clean';
import { IInfo } from '../../types/beatmap/v2/info';
import { IDifficulty } from '../../types/beatmap/v2/difficulty';
import { deepClean, purgeZeros } from '../shared/clean';

// deno-lint-ignore no-explicit-any
export function cleanDifficulty(data: Record<string, any> | IDifficulty, options: ICleanOptions) {
   for (const i1 in data._notes) {
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
   for (const i1 in data._obstacles) {
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
   for (const i1 in data._sliders) {
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
   for (const i1 in data._waypoints) {
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
   for (const i1 in data._events) {
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

// deno-lint-ignore no-explicit-any
export function cleanInfo(data: Record<string, any> | IInfo, options: ICleanOptions) {
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

   for (const it in data._colorSchemes) {
      const cs = data._colorSchemes[it];
      deepClean(cs.colorScheme, `info._colorSchemes[${it}].colorScheme`, options);
   }

   for (const i1 in data._difficultyBeatmapSets) {
      const set = data._difficultyBeatmapSets[i1];
      for (const i2 in set._difficultyBeatmaps) {
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
      deepClean(set._customData!, `info._difficultyBeatmapSets[${i1}]._customData`, options);
      if (!Object.keys(set._customData!).length) {
         delete set._customData;
      }
   }

   deepClean(data._customData!, 'info._customData', options);
   if (!Object.keys(data._customData!).length) {
      delete data._customData;
   }
}
