import type { CharacteristicName, DifficultyName } from 'bsmap/types';
import { IToolOutput } from './check';

interface IAnalysisBase {
   output: IToolOutput[];
}

export interface IAnalysisMap extends IAnalysisBase {
   characteristic: CharacteristicName;
   difficulty: DifficultyName;
}

export interface IAnalysis {
   general: IAnalysisBase;
   beatmap: IAnalysisMap[];
}
