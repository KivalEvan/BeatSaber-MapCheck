import { BPMChange } from './bpm';

export interface Note {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _type: number;
    _cutDirection: number;
    _customData?: CustomData;
    [key: string]: any;
}
export interface Event {
    _time: number;
    _type: number;
    _value: number;
    _customData?: CustomData;
    [key: string]: any;
}
export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData?: CustomData;
    [key: string]: any;
}
export interface Waypoint {
    [key: string]: any;
}

export interface BeatmapData {
    _version: string;
    _notes: Note[];
    _obstacles: Obstacle[];
    _events: Event[];
    _waypoints?: Waypoint[];
    _customData?: CustomData;
    _information?: CustomData;
}

export const parseMap = (
    difficultyData: BeatmapData,
    difficultyName: DifficultyName,
    bpm: number
): BeatmapData => {
    const { _notes, _obstacles, _events, _customData } = difficultyData;
    _notes.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _notes object`
                );
            }
        }
    });
    _obstacles.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _obstacles object`
                );
            }
        }
    });
    _events.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _events object`
                );
            }
        }
    });
    _notes.sort((a, b) => a._time - b._time);
    _obstacles.sort((a, b) => a._time - b._time);
    _events.sort((a, b) => a._time - b._time);

    if (_customData) {
        const BPMChanges: BPMChange[] = _customData._BPMChanges || _customData._bpmChanges;
        BPMChanges.forEach((bpmc) => (bpmc._BPM = bpmc._bpm ?? bpmc._BPM));
        if (BPMChanges && BPMChanges.length > 0) {
            let minBPM = bpm,
                maxBPM = bpm;
            for (let i = 0, len = BPMChanges.length; i < len; i++) {
                if (BPMChanges[i]._BPM < minBPM) {
                    minBPM = BPMChanges[i]._BPM;
                }
                if (BPMChanges[i]._BPM > maxBPM) {
                    maxBPM = BPMChanges[i]._BPM;
                }
            }
            difficultyData._information = {
                minBPM: minBPM,
                maxBPM: maxBPM,
            };
        }
    }
    return difficultyData;
};
