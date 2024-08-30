import { IBeatmapItem } from './checks/beatmapItem';
import { IContributorB64 } from './contributor';
import { IAnalysis } from './checks/analysis';
import * as types from 'bsmap/types';

export interface ILoadedData {
   beatmapInfo: types.wrapper.IWrapInfo | null;
   beatmaps: IBeatmapItem[];
   contributors: IContributorB64[];
   analysis: IAnalysis | null;
   duration: number | null;
}
