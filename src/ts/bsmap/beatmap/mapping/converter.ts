import { toV1Info } from '../converter/toV1/info.ts';
import { toV1Beatmap } from '../converter/toV1/beatmap.ts';
import { toV2Info } from '../converter/toV2/info.ts';
import { toV2Audio } from '../converter/toV2/audioData.ts';
import { toV2Beatmap } from '../converter/toV2/beatmap.ts';
import { toV3Beatmap } from '../converter/toV3/beatmap.ts';
import { toV4Info } from '../converter/toV4/info.ts';
import { toV4Audio } from '../converter/toV4/audioData.ts';
import { toV4Beatmap } from '../converter/toV4/beatmap.ts';
import type { IWrapInfo } from '../../types/beatmap/wrapper/info.ts';
import type { IWrapAudioData } from '../../types/beatmap/wrapper/audioData.ts';
import type { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap.ts';

export const infoConvertMap: Record<number, (data: IWrapInfo, sourceVer: number) => IWrapInfo> = {
   1: toV1Info,
   2: toV2Info,
   4: toV4Info,
};

export const audioDataConvertMap: Record<
   number,
   (data: IWrapAudioData, sourceVer: number) => IWrapAudioData
> = {
   2: toV2Audio,
   4: toV4Audio,
};

export const beatmapConvertMap: Record<
   number,
   (data: IWrapBeatmap, sourceVer: number) => IWrapBeatmap
> = {
   1: toV1Beatmap,
   2: toV2Beatmap,
   3: toV3Beatmap,
   4: toV4Beatmap,
};
