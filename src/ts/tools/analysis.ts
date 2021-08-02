import * as beatmap from '../beatmap';

export interface Analysis {
    missing: [];
    general: AnalysisBase;
    mapSet: AnalysisSet[];
}

interface AnalysisBase {
    html: HTMLElement[] | null;
}

export interface AnalysisSet extends AnalysisBase {
    mode: beatmap.characteristic.CharacteristicName;
    difficulty: beatmap.difficulty.DifficultyName;
    sps: number;
}
