import { IInfoData } from '../beatmap';
import { IBeatmapItem } from './tools/beatmapItem';
import { IContributorB64 } from './contributor';
import { IAnalysis } from './tools/analysis';

// TODO: structure bpm change for certain use
export interface ISavedData {
    beatmapInfo: IInfoData;
    beatmapDifficulty: IBeatmapItem[];
    contributors: IContributorB64[];
    analysis: IAnalysis;
    duration: number;
}
