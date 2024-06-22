import type { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap.ts';
import { sortNoteFn } from './sort.ts';
import type { TimeProcessor } from './timeProcessor.ts';

export function calculateNps(beatmap: IWrapBeatmap, duration: number): number {
   const notes = beatmap.difficulty.colorNotes;
   return duration ? notes.length / duration : 0;
}

export function calculateNpsPeak(
   beatmap: IWrapBeatmap,
   beatCount: number,
   timeProcessor: TimeProcessor,
): number {
   let peakNPS = 0;
   let currentSectionStart = 0;
   const notes = beatmap.difficulty.colorNotes;

   for (let i = 0; i < notes.length; i++) {
      while (notes[i].time - notes[currentSectionStart].time > beatCount) {
         currentSectionStart++;
      }
      peakNPS = Math.max(
         peakNPS,
         (i - currentSectionStart + 1) / timeProcessor.toRealTime(beatCount),
      );
   }

   return peakNPS;
}

export function getFirstInteractiveTime(beatmap: IWrapBeatmap): number {
   const notes = [
      ...beatmap.difficulty.colorNotes,
      ...beatmap.difficulty.bombNotes,
      ...beatmap.difficulty.chains,
   ].sort(sortNoteFn);
   let firstNoteTime = Number.MAX_VALUE;
   if (notes.length > 0) {
      firstNoteTime = notes[0].time;
   }
   const firstInteractiveObstacleTime = findFirstInteractiveObstacleTime(beatmap);
   return Math.min(firstNoteTime, firstInteractiveObstacleTime);
}

export function getLastInteractiveTime(beatmap: IWrapBeatmap): number {
   const notes = [
      ...beatmap.difficulty.colorNotes,
      ...beatmap.difficulty.bombNotes,
      ...beatmap.difficulty.chains,
   ].sort(sortNoteFn);
   let lastNoteTime = 0;
   if (notes.length > 0) {
      lastNoteTime = notes[notes.length - 1].time;
   }
   const lastInteractiveObstacleTime = findLastInteractiveObstacleTime(beatmap);
   return Math.max(lastNoteTime, lastInteractiveObstacleTime);
}

export function findFirstInteractiveObstacleTime(beatmap: IWrapBeatmap): number {
   for (let i = 0, len = beatmap.obstacles.length; i < len; i++) {
      if (beatmap.obstacles[i].isInteractive()) {
         return beatmap.obstacles[i].time;
      }
   }
   return Number.MAX_VALUE;
}

export function findLastInteractiveObstacleTime(beatmap: IWrapBeatmap): number {
   let obstacleEnd = 0;
   for (let i = beatmap.difficulty.obstacles.length - 1; i >= 0; i--) {
      if (beatmap.difficulty.obstacles[i].isInteractive()) {
         obstacleEnd = Math.max(
            obstacleEnd,
            beatmap.difficulty.obstacles[i].time + beatmap.difficulty.obstacles[i].duration,
         );
      }
   }
   return obstacleEnd;
}
