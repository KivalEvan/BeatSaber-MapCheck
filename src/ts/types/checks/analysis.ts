import type { CharacteristicName, DifficultyName } from 'bsmap/types';
import { ICheckOutput } from './check';

interface IAnalysisBase {
   output: ICheckOutput[];
}

export interface IAnalysisMap extends IAnalysisBase {
   characteristic: CharacteristicName;
   difficulty: DifficultyName;
}

export interface IAnalysis {
   general: IAnalysisBase;
   beatmap: IAnalysisMap[];
}
