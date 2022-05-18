import { CharacteristicName, DifficultyName } from '../../beatmap';
import { ISwingAnalysis } from '../analyzers/swing';

interface IAnalysisBase {
    html: HTMLElement[] | null;
}

export interface IAnalysisSet extends IAnalysisBase {
    mode: CharacteristicName;
    difficulty: DifficultyName;
    sps: ISwingAnalysis;
}

export interface IAnalysis {
    general: IAnalysisBase;
    map: IAnalysisSet[];
}
