/** Beatmap difficulty custom data interface for BPM Change Time Scale. */
export interface IBPMTimeScale {
   time: number;
   scale: number;
}

/**
 * @extends IBPMChange
 */
export interface IBPMChangeTime {
   time: number;
   newTime: number;
   BPM: number;
   beatsPerBar: number;
   metronomeOffset: number;
}
