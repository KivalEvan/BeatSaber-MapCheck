import { IBeatmapContainer } from './container';
import { IContributorB64 } from './contributor';
import { IAnalysis } from './checks/analysis';
import * as types from 'bsmap/types';

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
   info: types.wrapper.IWrapInfo | null;
   beatmaps: IBeatmapContainer[];
   contributors: IContributorB64[];
   analysis: IAnalysis | null;
   duration: number | null;
}
