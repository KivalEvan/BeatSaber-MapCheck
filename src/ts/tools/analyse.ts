import * as beatmap from '../beatmap';
import * as component from './component';
import savedData from '../savedData';

export const general = (): void => {};
export const difficulty = (
    mode?: beatmap.characteristic.CharacteristicName,
    difficulty?: beatmap.difficulty.DifficultyName
): void => {
    if (mode && difficulty) {
    }
};
