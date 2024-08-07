import { CharacteristicName } from '../../bsmap/types/beatmap/shared/characteristic';
import { DifficultyName } from '../../bsmap/types/beatmap/shared/difficulty';
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
