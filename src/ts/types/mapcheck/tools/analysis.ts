import { CharacteristicName } from '../../beatmap/shared/characteristic';
import { DifficultyName } from '../../beatmap/shared/difficulty';

interface IAnalysisBase {
   html: HTMLElement[] | null;
}

export interface IAnalysisMap extends IAnalysisBase {
   characteristic: CharacteristicName;
   difficulty: DifficultyName;
}

export interface IAnalysis {
   general: IAnalysisBase;
   map: IAnalysisMap[];
}
