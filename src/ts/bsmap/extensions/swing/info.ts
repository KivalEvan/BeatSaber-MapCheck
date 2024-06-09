import type { TimeProcessor } from '../../beatmap/helpers/timeProcessor.ts';
import type { CharacteristicName } from '../../types/beatmap/shared/characteristic.ts';
import type { DifficultyName } from '../../types/beatmap/shared/difficulty.ts';
import type { ISwingAnalysis, ISwingCount } from './types/swing.ts';
import { median } from '../../utils/math.ts';
import Swing from './swing.ts';
import type { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap.ts';
import { sortNoteFn } from '../../beatmap/helpers/sort.ts';

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to JavaScript is hard
// this is special function SPS used by ScoreSaber
export function count(
   colorNotes: IWrapColorNote[],
   duration: number,
   bpm: TimeProcessor,
): ISwingCount {
   const swingCount: ISwingCount = {
      left: new Array(Math.floor(duration + 1)).fill(0),
      right: new Array(Math.floor(duration + 1)).fill(0),
   };
   let lastRed!: IWrapColorNote;
   let lastBlue!: IWrapColorNote;
   for (const nc of colorNotes) {
      const realTime = bpm.toRealTime(nc.time);
      if (nc.color === 0) {
         if (lastRed) {
            if (Swing.next(nc, lastRed, bpm)) {
               swingCount.left[Math.floor(realTime)]++;
            }
         } else {
            swingCount.left[Math.floor(realTime)]++;
         }
         lastRed = nc;
      }
      if (nc.color === 1) {
         if (lastBlue) {
            if (Swing.next(nc, lastBlue, bpm)) {
               swingCount.right[Math.floor(realTime)]++;
            }
         } else {
            swingCount.right[Math.floor(realTime)]++;
         }
         lastBlue = nc;
      }
   }
   return swingCount;
}

function calcMaxRollingSps(swingArray: number[], x: number): number {
   if (!swingArray.length) {
      return 0;
   }
   if (swingArray.length < x) {
      return swingArray.reduce((a, b) => a + b) / swingArray.length;
   }
   let currentSPS = swingArray.slice(0, x).reduce((a, b) => a + b);
   let maxSPS = currentSPS;
   for (let i = 0; i < swingArray.length - x; i++) {
      currentSPS = currentSPS - swingArray[i] + swingArray[i + x];
      maxSPS = Math.max(maxSPS, currentSPS);
   }
   return maxSPS / x;
}

export function info(
   difficulty: IWrapBeatmap,
   bpm: TimeProcessor,
   charName: CharacteristicName,
   diffName: DifficultyName,
): ISwingAnalysis {
   const interval = 10;
   const spsInfo: ISwingAnalysis = {
      characteristic: charName,
      difficulty: diffName,
      red: { average: 0, peak: 0, median: 0, total: 0 },
      blue: { average: 0, peak: 0, median: 0, total: 0 },
      total: { average: 0, peak: 0, median: 0, total: 0 },
      container: Swing.generate(difficulty.colorNotes, bpm),
   };
   const duration = Math.max(
      bpm.toRealTime(getLastInteractiveTime(difficulty) - getFirstInteractiveTime(difficulty)),
      0,
   );
   const mapDuration = Math.max(bpm.toRealTime(getLastInteractiveTime(difficulty)), 0);
   const swing = count(difficulty.colorNotes, mapDuration, bpm);
   const swingTotal = swing.left.map((num, i) => num + swing.right[i]);
   if (swingTotal.reduce((a, b) => a + b) === 0) {
      return spsInfo;
   }
   const swingIntervalRed = [];
   const swingIntervalBlue = [];
   const swingIntervalTotal = [];

   for (let i = 0, len = Math.ceil(swingTotal.length / interval); i < len; i++) {
      const sliceStart = i * interval;
      let maxInterval = interval;
      if (maxInterval + sliceStart > swingTotal.length) {
         maxInterval = swingTotal.length - sliceStart;
      }
      const sliceRed = swing.left.slice(sliceStart, sliceStart + maxInterval);
      const sliceBlue = swing.right.slice(sliceStart, sliceStart + maxInterval);
      const sliceTotal = swingTotal.slice(sliceStart, sliceStart + maxInterval);
      swingIntervalRed.push(sliceRed.reduce((a, b) => a + b) / maxInterval);
      swingIntervalBlue.push(sliceBlue.reduce((a, b) => a + b) / maxInterval);
      swingIntervalTotal.push(sliceTotal.reduce((a, b) => a + b) / maxInterval);
   }

   spsInfo.red.total = swing.left.reduce((a, b) => a + b);
   spsInfo.red.average = swing.left.reduce((a, b) => a + b) / duration;
   spsInfo.red.peak = calcMaxRollingSps(swing.left, interval);
   spsInfo.red.median = median(swingIntervalRed);
   spsInfo.blue.total = swing.right.reduce((a, b) => a + b);
   spsInfo.blue.average = swing.right.reduce((a, b) => a + b) / duration;
   spsInfo.blue.peak = calcMaxRollingSps(swing.right, interval);
   spsInfo.blue.median = median(swingIntervalBlue);
   spsInfo.total.total = spsInfo.red.total + spsInfo.blue.total;
   spsInfo.total.average = swingTotal.reduce((a, b) => a + b) / duration;
   spsInfo.total.peak = calcMaxRollingSps(swingTotal, interval);
   spsInfo.total.median = median(swingIntervalTotal);

   return spsInfo;
}

export function getProgressionMax(
   spsArray: ISwingAnalysis[],
   minSPS: number,
): { result: ISwingAnalysis; comparedTo?: ISwingAnalysis } | null {
   let spsPerc = 0;
   let spsCurr = 0;
   let comparedTo;
   for (const spsMap of spsArray) {
      const overall = spsMap.total.average;
      if (spsCurr > 0 && overall > 0) {
         spsPerc = Math.abs(1 - spsCurr / overall) * 100;
      }
      spsCurr = overall > 0 ? overall : spsCurr;
      if (spsCurr > minSPS && spsPerc > 40) {
         return { result: spsMap, comparedTo };
      }
      comparedTo = spsMap;
   }
   return null;
}

export function getProgressionMin(
   spsArray: ISwingAnalysis[],
   minSPS: number,
): { result: ISwingAnalysis; comparedTo?: ISwingAnalysis } | null {
   let spsPerc = Number.MAX_SAFE_INTEGER;
   let spsCurr = 0;
   let comparedTo;
   for (const spsMap of spsArray) {
      const overall = spsMap.total.average;
      if (spsCurr > 0 && overall > 0) {
         spsPerc = Math.abs(1 - spsCurr / overall) * 100;
      }
      spsCurr = overall > 0 ? overall : spsCurr;
      if (spsCurr > minSPS && spsPerc < 10) {
         return { result: spsMap, comparedTo };
      }
      comparedTo = spsMap;
   }
   return null;
}

export function calcSpsTotalPercDrop(spsArray: ISwingAnalysis[]): number {
   let highest = 0;
   let lowest = Number.MAX_SAFE_INTEGER;
   spsArray.forEach((spsMap) => {
      const overall = spsMap.total.average;
      if (overall > 0) {
         highest = Math.max(highest, overall);
         lowest = Math.min(lowest, overall);
      }
   });
   return highest || (highest && lowest) ? (1 - lowest / highest) * 100 : 0;
}

export function getSpsLowest(spsArray: ISwingAnalysis[]): number {
   return Math.min(...spsArray.map((e) => e.total.average), Number.MAX_SAFE_INTEGER);
}

export function getSpsHighest(spsArray: ISwingAnalysis[]): number {
   return Math.max(...spsArray.map((e) => e.total.average), 0);
}

function getLastInteractiveTime(bm: IWrapBeatmap): number {
   const notes = [...bm.colorNotes, ...bm.chains, ...bm.bombNotes].sort(sortNoteFn);
   let lastNoteTime = 0;
   if (notes.length > 0) {
      lastNoteTime = notes[notes.length - 1].time;
   }
   const lastInteractiveObstacleTime = findLastInteractiveObstacleTime(bm);
   return Math.max(lastNoteTime, lastInteractiveObstacleTime);
}

function getFirstInteractiveTime(bm: IWrapBeatmap): number {
   const notes = [...bm.colorNotes, ...bm.chains, ...bm.bombNotes].sort(sortNoteFn);
   let firstNoteTime = Number.MAX_VALUE;
   if (notes.length > 0) {
      firstNoteTime = notes[0].time;
   }
   const firstInteractiveObstacleTime = findFirstInteractiveObstacleTime(bm);
   return Math.min(firstNoteTime, firstInteractiveObstacleTime);
}

function findFirstInteractiveObstacleTime(bm: IWrapBeatmap): number {
   for (let i = 0, len = bm.obstacles.length; i < len; i++) {
      if (bm.obstacles[i].isInteractive()) {
         return bm.obstacles[i].time;
      }
   }
   return Number.MAX_VALUE;
}

function findLastInteractiveObstacleTime(bm: IWrapBeatmap): number {
   let obstacleEnd = 0;
   for (let i = bm.obstacles.length - 1; i >= 0; i--) {
      if (bm.obstacles[i].isInteractive()) {
         obstacleEnd = Math.max(obstacleEnd, bm.obstacles[i].time + bm.obstacles[i].duration);
      }
   }
   return obstacleEnd;
}
