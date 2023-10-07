import { IWrapInfo } from '../beatmap/wrapper/info';
import { IBeatmapItem } from './tools/beatmapItem';
import { IContributorB64 } from './contributor';
import { IAnalysis } from './tools/analysis';

export interface ISavedData {
   beatmapInfo: IWrapInfo | null;
   beatmapDifficulty: IBeatmapItem[];
   contributors: IContributorB64[];
   analysis: IAnalysis | null;
   duration: number | null;
}
