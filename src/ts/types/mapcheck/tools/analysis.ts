import { CharacteristicName, DifficultyName } from '../../beatmap';

interface IAnalysisBase {
    html: HTMLElement[] | null;
}

export interface IAnalysisMap extends IAnalysisBase {
    mode: CharacteristicName;
    difficulty: DifficultyName;
}

export interface IAnalysis {
    general: IAnalysisBase;
    map: IAnalysisMap[];
}
