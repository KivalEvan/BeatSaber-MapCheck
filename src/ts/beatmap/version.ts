import { DifficultyData as DifficultyDataV2 } from './v2/difficulty';
import { DifficultyData as DifficultyDataV3 } from './v3/difficulty';

export const isV2 = (data: DifficultyDataV2 | DifficultyDataV3): data is DifficultyDataV2 => {
    if (data.version.startsWith('2')) {
        return true;
    }
    return false;
};

export const isV3 = (data: DifficultyDataV2 | DifficultyDataV3): data is DifficultyDataV3 => {
    if (data.version.startsWith('3')) {
        return true;
    }
    return false;
};
