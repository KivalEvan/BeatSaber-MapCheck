import { types } from 'bsmap';
import { IToolOutput } from './check';

interface IAnalysisBase {
   output: IToolOutput[];
}

export interface IAnalysisMap extends IAnalysisBase {
   characteristic: types.CharacteristicName;
   difficulty: types.DifficultyName;
}

export interface IAnalysis {
   general: IAnalysisBase;
   beatmap: IAnalysisMap[];
}
