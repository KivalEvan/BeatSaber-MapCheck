import * as beatmap from '../beatmap';

export interface Analysis {
    missing: [];
    general: AnalysisBase;
    mapSet: AnalysisSet[];
    sps: beatmap.v2.swing.SwingAnalysis[];
}

interface AnalysisBase {
    html: HTMLElement[] | null;
}

export interface AnalysisSet extends AnalysisBase {
    mode: beatmap.types.CharacteristicName;
    difficulty: beatmap.types.DifficultyName;
}
