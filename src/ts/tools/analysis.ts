import * as beatmap from '../beatmap';

export interface Analysis {
    missing: [];
    general: AnalysisBase;
    mapSet: AnalysisSet[];
    sps: beatmap.swing.SwingAnalysis[];
}

interface AnalysisBase {
    html: HTMLElement[] | null;
}

export interface AnalysisSet extends AnalysisBase {
    mode: beatmap.types.characteristic.CharacteristicName;
    difficulty: beatmap.types.difficulty.DifficultyName;
}
