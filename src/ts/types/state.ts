import { IBeatmapContainer } from './container';
import { IContributorB64 } from './contributor';
import { IAnalysis } from './checks/analysis';
import { wrapper } from 'bsmap';

export interface IStateFlag {
   nested: boolean;
   info: boolean;
   difficulty: boolean;
   analysis: boolean;
   audio: boolean;
   coverImage: boolean;
   contributorImage: boolean;
   finished: boolean;
}

export interface IStateData {
   info: wrapper.IWrapInfo | null;
   beatmaps: IBeatmapContainer[];
   contributors: IContributorB64[];
   analysis: IAnalysis | null;
   duration: number | null;
}
