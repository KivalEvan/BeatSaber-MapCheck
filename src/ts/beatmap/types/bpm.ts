/**
 * Beatmap difficulty custom data interface for BPM Change.
 *
 *     _time: float,
 *     _BPM: float,
 *     _beatsPerBar: int,
 *     _metronomeOffset: float
 */
export interface BPMChange {
    _time: number;
    _bpm?: never;
    _BPM: number;
    _beatsPerBar: number;
    _metronomeOffset: number;
}

/**
 * Beatmap difficulty custom data interface for MediocreMapper BPM Change.
 *
 *     _time: float,
 *     _bpm: float,
 *     _beatsPerBar: int,
 *     _metronomeOffset: float
 */
export interface BPMChangeOld {
    _time: number;
    _bpm: number;
    _BPM: never;
    _beatsPerBar: number;
    _metronomeOffset: number;
}

/**
 * @extends BPMChange
 *
 *     _newTime: float,
 */
export interface BPMChangeTime extends BPMChange {
    _newTime: number;
}
