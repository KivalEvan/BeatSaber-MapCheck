import savedData from '../savedData';
import { CharacteristicName } from '../beatmap/characteristic';
import { DifficultyName } from '../beatmap/difficulty';

interface Analysis {
    missing: [];
    mapSet: AnalysisSet;
}

interface AnalysisSet {
    mode: CharacteristicName;
    difficulty: DifficultyName;
    sps: number;
    htmlOutput: HTMLElement | string;
}

export const general = (): void => {};
export const difficulty = (mode?: CharacteristicName, difficulty?: DifficultyName): void => {
    if (mode && difficulty) {
    }
};
