import { CharacteristicName, DifficultyName } from '../../beatmap';
import { SwingAnalysis } from '../../beatmap/shared/swing';

interface IAnalysisBase {
    html: HTMLElement[] | null;
}

export interface IAnalysisSet extends IAnalysisBase {
    mode: CharacteristicName;
    difficulty: DifficultyName;
}

export interface IAnalysis {
    missing: [];
    general: IAnalysisBase;
    mapSet: IAnalysisSet[];
    sps: SwingAnalysis[];
}
