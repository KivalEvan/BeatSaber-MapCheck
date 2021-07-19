import savedData from '../savedData';
import { CharacteristicName } from '../beatmap/characteristic';
import { DifficultyName } from '../beatmap/difficulty';

const general = (): void => {};
const difficulty = (mode?: CharacteristicName, difficulty?: DifficultyName): void => {
    if (mode && difficulty) {
    }
};

export default { general, difficulty };
