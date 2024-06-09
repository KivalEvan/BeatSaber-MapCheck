/** Beatmap difficulty custom data interface for BPM Change. */
export interface IBPMChange {
   _time: number;
   _bpm?: never;
   _BPM: number;
   _beatsPerBar: number;
   _metronomeOffset: number;
}

/** Beatmap difficulty custom data interface for MediocreMapper BPM Change. */
export interface IBPMChangeOld {
   _time: number;
   _bpm: number;
   _BPM: never;
   _beatsPerBar: number;
   _metronomeOffset: number;
}
