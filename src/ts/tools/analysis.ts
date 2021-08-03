import * as beatmap from '../beatmap';
import { SwingAnalysis } from './swing';

export interface Analysis {
    missing: [];
    general: AnalysisBase;
    mapSet: AnalysisSet[];
    sps: SwingAnalysis[];
}

interface AnalysisBase {
    html: HTMLElement[] | null;
}

export interface AnalysisSet extends AnalysisBase {
    mode: beatmap.characteristic.CharacteristicName;
    difficulty: beatmap.difficulty.DifficultyName;
}
