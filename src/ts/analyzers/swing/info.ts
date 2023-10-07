import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { Difficulty } from '../../beatmap/v3/difficulty';
import { CharacteristicName } from '../../types/beatmap/shared/characteristic';
import { DifficultyName } from '../../types/beatmap/shared/difficulty';
import { NoteContainer } from '../../types/beatmap/wrapper/container';
import { ISwingAnalysis, ISwingCount } from './types/swing';
import { median } from '../../utils/math';
import Swing from './swing';

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to JavaScript is hard
// this is special function SPS used by ScoreSaber
export function count(
   noteContainer: NoteContainer[],
   duration: number,
   bpm: BeatPerMinute,
): ISwingCount {
   const swingCount: ISwingCount = {
      left: new Array(Math.floor(duration + 1)).fill(0),
      right: new Array(Math.floor(duration + 1)).fill(0),
   };
   let lastRed!: NoteContainer;
   let lastBlue!: NoteContainer;
   for (const nc of noteContainer) {
      if (nc.type !== 'note') {
         continue;
      }
      const realTime = bpm.toRealTime(nc.data.time);
      if (nc.data.color === 0) {
         if (lastRed) {
            if (Swing.next(nc, lastRed, bpm)) {
               swingCount.left[Math.floor(realTime)]++;
            }
         } else {
            swingCount.left[Math.floor(realTime)]++;
         }
         lastRed = nc;
      }
      if (nc.data.color === 1) {
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
   difficulty: Difficulty,
   bpm: BeatPerMinute,
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
      container: Swing.generate(difficulty.getNoteContainer(), bpm),
   };
   const duration = Math.max(
      bpm.toRealTime(difficulty.getLastInteractiveTime() - difficulty.getFirstInteractiveTime()),
      0,
   );
   const mapDuration = Math.max(bpm.toRealTime(difficulty.getLastInteractiveTime()), 0);
   const swing = count(difficulty.getNoteContainer(), mapDuration, bpm);
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
   let lowest = Number.MAX_SAFE_INTEGER;
   spsArray.forEach((spsMap) => {
      const overall = spsMap.total.average;
      if (overall > 0) {
         lowest = Math.min(lowest, overall);
      }
   });
   return lowest;
}

export function getSpsHighest(spsArray: ISwingAnalysis[]): number {
   let highest = 0;
   spsArray.forEach((spsMap) => {
      const overall = spsMap.total.average;
      if (overall > 0) {
         highest = Math.max(highest, overall);
      }
   });
   return highest;
}
