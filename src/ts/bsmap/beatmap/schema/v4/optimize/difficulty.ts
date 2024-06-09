import { round } from '../../../../utils/math.ts';
import type { IOptimizeOptions } from '../../../../types/beatmap/options/optimize.ts';
import type { IDifficulty } from '../../../../types/beatmap/v4/difficulty.ts';
import { deepClean, purgeZeros, remapDedupe } from '../../../helpers/optimize.ts';

export function optimizeDifficulty(data: IDifficulty, options: IOptimizeOptions) {
   if (options.deduplicate) {
      const [newNoteColorData, remapColorNoteIdx] = remapDedupe(data.colorNotesData);
      const [newBombNoteData, remapBombNoteIdx] = remapDedupe(data.bombNotesData);
      const [newObstacleData, remapObstacleIdx] = remapDedupe(data.obstaclesData);
      const [newChainData, remapChainIdx] = remapDedupe(data.chainsData);
      const [newArcData, remapArcIdx] = remapDedupe(data.arcsData);
      const [newSRData, remapSRIdx] = remapDedupe(data.spawnRotationsData);

      data.colorNotes.forEach((d) => (d.i = remapColorNoteIdx.get(d.i!)));
      data.bombNotes.forEach((d) => (d.i = remapBombNoteIdx.get(d.i!)));
      data.obstacles.forEach((d) => (d.i = remapObstacleIdx.get(d.i!)));
      data.chains.forEach((d) => {
         d.ci = remapChainIdx.get(d.ci!);
         d.i = remapColorNoteIdx.get(d.i!);
      });
      data.arcs.forEach((d) => {
         d.ai = remapArcIdx.get(d.ai!);
         d.hi = remapColorNoteIdx.get(d.hi!);
         d.ti = remapColorNoteIdx.get(d.ti!);
      });
      data.spawnRotations.forEach((d) => (d.i = remapSRIdx.get(d.i!)));

      data.colorNotesData = newNoteColorData;
      data.bombNotesData = newBombNoteData;
      data.obstaclesData = newObstacleData;
      data.chainsData = newChainData;
      data.arcsData = newArcData;
      data.spawnRotationsData = newSRData;
   }

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
