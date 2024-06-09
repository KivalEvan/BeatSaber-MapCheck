import type { IDataCheck } from '../../types/beatmap/shared/dataCheck.ts';
import {
   DifficultyDataCheck as V1DifficultyDataCheck,
   InfoDataCheck as V1InfoDataCheck,
} from '../schema/v1/dataCheck.ts';
import {
   BPMInfoDataCheck as V2AudioDataCheck,
   DifficultyDataCheck as V2DifficultyDataCheck,
   InfoDataCheck as V2InfoDataCheck,
} from '../schema/v2/dataCheck.ts';
import {
   DifficultyDataCheck as V3DifficultyDataCheck,
   LightshowDataCheck as V3LightshowDataCheck,
} from '../schema/v3/dataCheck.ts';
import {
   AudioDataCheck as V4AudioDataCheck,
   DifficultyDataCheck as V4DifficultyDataCheck,
   InfoDataCheck as V4InfoDataCheck,
   LightshowDataCheck as V4LightshowDataCheck,
} from '../schema/v4/dataCheck.ts';

export const infoCheckMap: Record<number, Record<string, IDataCheck>> = {
   1: V1InfoDataCheck,
   2: V2InfoDataCheck,
   4: V4InfoDataCheck,
};

export const audioDataCheckMap: Record<number, Record<string, IDataCheck>> = {
   2: V2AudioDataCheck,
   4: V4AudioDataCheck,
};

export const difficultyCheckMap: Record<number, Record<string, IDataCheck>> = {
   1: V1DifficultyDataCheck,
   2: V2DifficultyDataCheck,
   3: V3DifficultyDataCheck,
   4: V4DifficultyDataCheck,
};

export const lightshowCheckMap: Record<number, Record<string, IDataCheck>> = {
   3: V3LightshowDataCheck,
   4: V4LightshowDataCheck,
};
