import * as beatmap from '../beatmap';

export interface Analysis {
    missing: [];
    mapSet: AnalysisSet;
}

interface AnalysisSet {
    mode: beatmap.characteristic.CharacteristicName;
    difficulty: beatmap.difficulty.DifficultyName;
    sps: number;
    htmlOutput: HTMLElement | string;
}
