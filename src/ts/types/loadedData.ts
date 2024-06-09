import { IWrapInfo } from '../bsmap/types/beatmap/wrapper/info';
import { IBeatmapItem } from './tools/beatmapItem';
import { IContributorB64 } from './contributor';
import { IAnalysis } from './tools/analysis';

export interface ILoadedData {
   beatmapInfo: IWrapInfo | null;
   beatmaps: IBeatmapItem[];
   contributors: IContributorB64[];
   analysis: IAnalysis | null;
   duration: number | null;
}
