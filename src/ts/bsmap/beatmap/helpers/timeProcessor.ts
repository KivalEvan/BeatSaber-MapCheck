import type { IBPMChangeTime, IBPMTimeScale } from '../../types/beatmap/shared/custom/bpm.ts';
import type {
   IBPMChange as IV2BPMChange,
   IBPMChangeOld,
} from '../../types/beatmap/v2/custom/bpmChange.ts';
import type { IBPMChange as IV3BPMChange } from '../../types/beatmap/v3/custom/bpmChange.ts';
import type { IBPMEvent } from '../../types/beatmap/v3/bpmEvent.ts';
import type { IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent.ts';
import logger from '../../logger.ts';

function tag(name: string): string[] {
   return ['helpers', 'timeProcessor', name];
}

/** Time processor for various utility around adjusted beat time, JSON time, reaction time, etc. */
export class TimeProcessor {
   bpm: number;
   private _bpmChange: IBPMChangeTime[];
   private _timeScale: IBPMTimeScale[];
   private _offset: number;

   constructor(
      bpm: number,
      bpmChange: (
         | IV2BPMChange
         | IBPMChangeOld
         | IV3BPMChange
         | IBPMEvent
         | Omit<IWrapBPMEventAttribute, 'customData'>
         | IBPMTimeScale
      )[] = [],
      offset: number = 0,
   ) {
      this.bpm = bpm;
      this._offset = offset / 1000;
      this._timeScale = this.getTimeScale(
         bpmChange.filter(
            (bc) => ('m' in bc || 'bpm' in bc || 'timescale' in bc) && !('o' in bc),
         ) as IBPMEvent[],
      );
      this._bpmChange = this.getBpmChangeTime(
         bpmChange.filter(
            (bc) =>
               ('BPM' in bc && 'metronomeOffset' in bc) ||
               (('_bpm' in bc || '_BPM' in bc) && '_metronomeOffset' in bc) ||
               ('m' in bc && 'o' in bc),
         ) as (IV2BPMChange | IBPMChangeOld | IV3BPMChange)[],
      );
      if (this._timeScale.length && this._bpmChange.length) {
         logger.tWarn(
            tag('constructor'),
            'BPM change and BPM event should not be used along side together to avoid confusion between editors and in-game behaviour',
         );
      }
   }

   /**
    * Create and return an instance of BeatPerMinute class.
    * ```ts
    * const bpm = BeatPerMinute.create(bpm, bpmc, 0);
    * ```
    */
   static create = (
      bpm: number,
      bpmChange?: (
         | IV2BPMChange
         | IBPMChangeOld
         | IV3BPMChange
         | IBPMEvent
         | Omit<IWrapBPMEventAttribute, 'customData'>
         | IBPMTimeScale
      )[],
      offset?: number,
   ): TimeProcessor => {
      return new TimeProcessor(bpm, bpmChange, offset);
   };

   get change(): IBPMChangeTime[] {
      return this._bpmChange;
   }
   set change(val: (IBPMChangeTime | IV2BPMChange | IBPMChangeOld | IV3BPMChange)[]) {
      this._bpmChange = this.getBpmChangeTime(val);
   }
   get timescale(): IBPMTimeScale[] {
      return this._timeScale;
   }
   set timescale(val: (IBPMTimeScale | IBPMEvent | Omit<IWrapBPMEventAttribute, 'customData'>)[]) {
      this._timeScale = this.getTimeScale(val);
   }
   get offset(): number {
      return this._offset * 1000;
   }
   set offset(val: number) {
      this._offset = val / 1000;
   }

   /**
    * Create new BPM change object that allow time to be read according to editor.
    * ```ts
    * const newBpmChange = bpm.getBpmChangeTime(bpmc);
    * ```
    */
   private getBpmChangeTime(
      bpmc: (IBPMChangeTime | IV2BPMChange | IBPMChangeOld | IV3BPMChange)[] = [],
   ): IBPMChangeTime[] {
      let temp!: IBPMChangeTime;
      const bpmChange: IBPMChangeTime[] = [];
      bpmc = [...bpmc].sort(
         (a, b) =>
            ((a as IBPMChangeTime).time ?? (a as IV2BPMChange)._time ?? (a as IV3BPMChange).b) -
            ((b as IBPMChangeTime).time ?? (b as IV2BPMChange)._time ?? (b as IV3BPMChange).b),
      );
      for (let i = 0; i < bpmc.length; i++) {
         const curBPMC: IBPMChangeTime = {
            time:
               (bpmc[i] as IBPMChangeTime).time ??
               (bpmc[i] as IV2BPMChange)._time ??
               (bpmc[i] as IV3BPMChange).b,
            BPM:
               (bpmc[i] as IBPMChangeTime).BPM ??
               (bpmc[i] as IV2BPMChange)._BPM ??
               (bpmc[i] as IBPMChangeOld)._bpm ??
               (bpmc[i] as IV3BPMChange).m,
            beatsPerBar:
               (bpmc[i] as IBPMChangeTime).beatsPerBar ??
               (bpmc[i] as IV2BPMChange)._beatsPerBar ??
               (bpmc[i] as IV3BPMChange).p,
            metronomeOffset:
               (bpmc[i] as IBPMChangeTime).metronomeOffset ??
               (bpmc[i] as IV2BPMChange)._metronomeOffset ??
               (bpmc[i] as IV3BPMChange).o,
            newTime: 0,
         };
         if (temp) {
            curBPMC.newTime = Math.ceil(
               ((curBPMC.time - temp.time) / this.bpm) * temp.BPM + temp.newTime - 0.01,
            );
         } else {
            curBPMC.newTime = Math.ceil(curBPMC.time - (this._offset * this.bpm) / 60 - 0.01);
         }
         bpmChange.push(curBPMC);
         temp = curBPMC;
      }
      return bpmChange;
   }

   /**
    * Create new time scale object that adjust beat to BPM event.
    * ```ts
    * const newTimeScale = bpm.getTimeScale(bpmc);
    * ```
    */
   private getTimeScale(
      bpmc: (IBPMTimeScale | IBPMEvent | Omit<IWrapBPMEventAttribute, 'customData'>)[] = [],
   ): IBPMTimeScale[] {
      return [...bpmc]
         .sort(
            (a, b) =>
               ((a as IWrapBPMEventAttribute).time ?? (a as IV3BPMChange).b) -
               ((b as IWrapBPMEventAttribute).time ?? (b as IV3BPMChange).b),
         )
         .map((el) => {
            if ('scale' in el) return el;
            if ('bpm' in el) return { time: el.time, scale: this.bpm / el.bpm };
            return { time: el.b || 0, scale: this.bpm / el.m! };
         });
   }

   /**
    * Adjust beat time by offset.
    * ```ts
    * const removedOffset = bpm.offsetBegone(beat);
    * ```
    */
   private offsetBegone(beat: number): number {
      return this.toBeatTime(this.toRealTime(beat, false) - this._offset);
   }

   /**
    * Convert beat time to real-time in second.
    * ```ts
    * const realTime = bpm.toRealTime(beat);
    * ```
    */
   // this is stupid
   toRealTime(beat: number, timescale = true): number {
      if (!timescale) {
         return (beat / this.bpm) * 60;
      }
      let calculatedBeat = 0;
      for (let i = this._timeScale.length - 1; i >= 0; i--) {
         if (beat > this._timeScale[i].time) {
            calculatedBeat += (beat - this._timeScale[i].time) * this._timeScale[i].scale;
            beat = this._timeScale[i].time;
         }
      }
      return ((beat + calculatedBeat) / this.bpm) * 60;
   }

   /**
    * Convert real-time in second to beat time.
    * ```ts
    * const beatTime = bpm.toBeatTime(rt);
    * ```
    */
   // this is stupid 2 electric boogaloo
   toBeatTime(seconds: number, timescale = false): number {
      if (!timescale) {
         return (seconds * this.bpm) / 60;
      }
      let calculatedSecond = 0;
      for (let i = this._timeScale.length - 1; i >= 0; i--) {
         const currentSeconds = this.toRealTime(this._timeScale[i].time);
         if (seconds > currentSeconds) {
            calculatedSecond += (seconds - currentSeconds) / this._timeScale[i].scale;
            seconds = currentSeconds;
         }
      }
      return this.toBeatTime(seconds + calculatedSecond);
   }

   /**
    * Convert editor beat time to actual JSON time.
    * ```ts
    * const JsonTime = bpm.toJsonTime(beat);
    * ```
    *
    * This only works with custom data BPM change.
    */
   toJsonTime(beat: number): number {
      for (let i = this._bpmChange.length - 1; i >= 0; i--) {
         if (beat > this._bpmChange[i].newTime) {
            return (
               ((beat - this._bpmChange[i].newTime) / this._bpmChange[i].BPM) * this.bpm +
               this._bpmChange[i].time
            );
         }
      }
      return this.toBeatTime(this.toRealTime(beat, false) + this._offset);
   }

   /**
    * Adjust beat time from BPM changes and offset.
    * ```ts
    * const adjustedBeat = bpm.adjustTime(beat);
    * ```
    */
   adjustTime(beat: number): number {
      for (let i = this._bpmChange.length - 1; i >= 0; i--) {
         if (beat > this._bpmChange[i].time) {
            return (
               ((beat - this._bpmChange[i].time) / this.bpm) * this._bpmChange[i].BPM +
               this._bpmChange[i].newTime
            );
         }
      }
      return this.offsetBegone(beat);
   }
}
