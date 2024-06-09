import { info as V1Info } from '../schema/v1/info.ts';
import { info as V2Info } from '../schema/v2/info.ts';
import { info as V4Info } from '../schema/v4/info.ts';
import { audioData as V2AudioData } from '../schema/v2/audioData.ts';
import { audioData as V4AudioData } from '../schema/v4/audioData.ts';
import { difficulty as V1Difficulty } from '../schema/v1/difficulty.ts';
import { difficulty as V2Difficulty } from '../schema/v2/difficulty.ts';
import { difficulty as V3Difficulty } from '../schema/v3/difficulty.ts';
import { difficulty as V4Difficulty } from '../schema/v4/difficulty.ts';
import { lightshow as V3Lightshow } from '../schema/v3/lightshow.ts';
import { lightshow as V4Lightshow } from '../schema/v4/lightshow.ts';
import type { ISchemaContainer } from '../../types/beatmap/shared/schema.ts';
import type { IWrapInfoAttribute } from '../../types/beatmap/wrapper/info.ts';
import type { IWrapBeatmapAttribute } from '../../types/beatmap/wrapper/beatmap.ts';
import type { IWrapAudioDataAttribute } from '../../types/beatmap/wrapper/audioData.ts';

export const infoSchemaMap: Record<number, ISchemaContainer<IWrapInfoAttribute>> = {
   1: V1Info,
   2: V2Info,
   4: V4Info,
};

export const audioDataSchemaMap: Record<number, ISchemaContainer<IWrapAudioDataAttribute>> = {
   2: V2AudioData,
   4: V4AudioData,
};

export const difficultySchemaMap: Record<number, ISchemaContainer<IWrapBeatmapAttribute>> = {
   1: V1Difficulty,
   2: V2Difficulty,
   3: V3Difficulty,
   4: V4Difficulty,
};

export const lightshowSchemaMap: Record<number, ISchemaContainer<IWrapBeatmapAttribute>> = {
   3: V3Lightshow,
   4: V4Lightshow,
};
