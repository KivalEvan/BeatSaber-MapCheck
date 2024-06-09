import type {
   ICustomDataInfo as ICustomDataInfoV2,
   ICustomDataInfoDifficulty as ICustomDataInfoBeatmapV2,
   ICustomDataInfoSet as ICustomDataInfoSetV2,
} from '../../v2/custom/info.ts';
import type {
   ICustomDataInfo as ICustomDataInfoV4,
   ICustomDataInfoBeatmap as ICustomDataInfoBeatmapV4,
} from '../../v4/custom/info.ts';

export type ICustomDataInfo = ICustomDataInfoV2 & ICustomDataInfoSetV2 & ICustomDataInfoV4;
export type ICustomDataBeatmap = ICustomDataInfoBeatmapV2 & ICustomDataInfoBeatmapV4;
