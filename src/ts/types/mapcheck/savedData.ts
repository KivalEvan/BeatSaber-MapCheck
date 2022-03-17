import { IInfoData } from '../beatmap';
import { IBeatmapDataItem } from './beatmapList';
import { IContributorB64 } from './contributor';
import { IAnalysis } from './tools/analysis';

// TODO: structure bpm change for certain use
export interface ISavedData {
    beatmapInfo: IInfoData;
    beatmapDifficulty: IBeatmapDataItem[];
    contributors: IContributorB64[];
    analysis: IAnalysis;
    duration: number;
}
