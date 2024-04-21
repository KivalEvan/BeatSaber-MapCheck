import { round } from '../../utils/math.ts';
import type { ICleanOptions } from '../../types/beatmap/shared/clean.ts';
import type { IInfo } from '../../types/beatmap/v4/info.ts';
import type { IDifficulty } from '../../types/beatmap/v4/difficulty.ts';
import type { ILightshow } from '../../types/beatmap/v4/lightshow.ts';
import { deepClean, purgeZeros } from '../shared/clean.ts';

export function cleanDifficulty(data: IDifficulty, options: ICleanOptions) {
   for (let i = 0; i < data.arcs.length; i++) {
      const o = data.arcs[i];
      if (options.floatTrim) {
         o.hb = round(o.hb!, options.floatTrim);
         o.hr = round(o.hr!, options.floatTrim);
         o.tb = round(o.tb!, options.floatTrim);
         o.tr = round(o.tr!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.arcs[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.arcsData.length; i++) {
      const o = data.arcsData[i];
      if (options.floatTrim) {
         o.m = round(o.m!, options.floatTrim);
         o.tm = round(o.tm!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.arcsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.bombNotes.length; i++) {
      const o = data.bombNotes[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.bombNotes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.bombNotesData.length; i++) {
      const o = data.bombNotesData[i];
      deepClean(o.customData!, `difficulty.bombNotesData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.chains.length; i++) {
      const o = data.chains[i];
      if (options.floatTrim) {
         o.hb = round(o.hb!, options.floatTrim);
         o.hr = round(o.hr!, options.floatTrim);
         o.tb = round(o.tb!, options.floatTrim);
         o.tr = round(o.tr!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.chains[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.chainsData.length; i++) {
      const o = data.chainsData[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.chainsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.colorNotes.length; i++) {
      const o = data.colorNotes[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
         o.r = round(o.r!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.colorNotes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.colorNotesData.length; i++) {
      const o = data.colorNotesData[i];
      if (options.floatTrim) {
         o.a = round(o.a!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.colorNotesData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.obstacles.length; i++) {
      const o = data.obstacles[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
         o.r = round(o.r!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.obstacles[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.obstaclesData.length; i++) {
      const o = data.obstaclesData[i];
      if (options.floatTrim) {
         o.d = round(o.d!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.obstaclesData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   deepClean(data.customData!, `difficulty.customData`, options);
   if (!Object.keys(data.customData!).length) {
      delete data.customData;
   }
}

export function cleanLightshow(data: ILightshow, options: ICleanOptions) {
   for (let i = 0; i < data.waypoints.length; i++) {
      const o = data.waypoints[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
         o.r = round(o.r!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.waypoints[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.waypointsData.length; i++) {
      const o = data.waypointsData[i];
      deepClean(o.customData!, `difficulty.waypointsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.basicEvents.length; i++) {
      const o = data.basicEvents[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.basicEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.basicEventsData.length; i++) {
      const o = data.basicEventsData[i];
      if (options.floatTrim) {
         o.f = round(o.f!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.basicEventsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.colorBoostEvents.length; i++) {
      const o = data.colorBoostEvents[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.colorBoostEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.colorBoostEventsData.length; i++) {
      const o = data.colorBoostEventsData[i];
      deepClean(o.customData!, `difficulty.colorBoostEventsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.eventBoxGroups.length; i++) {
      const o = data.eventBoxGroups[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
      }
      for (let j = 0; j < o.e!.length; j++) {
         const o2 = o.e![j];
         deepClean(o2.customData!, `lightshow.eventBoxGroups[${i}].e[${j}].customData`, options);
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         if (options.purgeZeros) purgeZeros(o2);
         for (let k = 0; k < o2.l!.length; k++) {
            const o3 = o2.l![k];
            if (options.floatTrim) {
               o3.b = round(o3.b!, options.floatTrim);
            }
            if (options.purgeZeros) purgeZeros(o3);
         }
      }
      deepClean(o.customData!, `difficulty.eventBoxGroups[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.indexFilters.length; i++) {
      const o = data.indexFilters[i];
      if (options.floatTrim) {
         o.l = round(o.l!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.indexFilters[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightColorEventBoxes.length; i++) {
      const o = data.lightColorEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightColorEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightColorEvents.length; i++) {
      const o = data.lightColorEvents[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
         o.sb = round(o.sb!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightColorEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightRotationEventBoxes.length; i++) {
      const o = data.lightRotationEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightRotationEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightRotationEvents.length; i++) {
      const o = data.lightRotationEvents[i];
      if (options.floatTrim) {
         o.r = round(o.r!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightRotationEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightTranslationEventBoxes.length; i++) {
      const o = data.lightTranslationEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightTranslationEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightTranslationEvents.length; i++) {
      const o = data.lightTranslationEvents[i];
      if (options.floatTrim) {
         o.t = round(o.t!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightTranslationEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.fxEventBoxes.length; i++) {
      const o = data.fxEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.fxEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.floatFxEvents.length; i++) {
      const o = data.floatFxEvents[i];
      if (options.floatTrim) {
         o.v = round(o.v!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.floatFxEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (const o1 of data.basicEventTypesWithKeywords.d!) {
      if (options.stringTrim) {
         o1.k = o1.k!.trim();
      }
   }
   deepClean(data.customData!, `lightshow.customData`, options);
   if (!Object.keys(data.customData!).length) {
      delete data.customData;
   }
}

export function cleanInfo(data: IInfo, options: ICleanOptions) {
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
