import { InfoData } from './types/info';
import { CharacteristicOrder } from './types/characteristic';
import { DifficultyRank } from './types/difficulty';

// TODO: more error check
// TODO: contemplate whether to make pure function or keep as is
export const info = (infoData: InfoData): InfoData => {
    console.log('Parsing info');
    infoData._difficultyBeatmapSets.sort(
        (a, b) =>
            CharacteristicOrder[a._beatmapCharacteristicName] -
            CharacteristicOrder[b._beatmapCharacteristicName]
    );
    infoData._difficultyBeatmapSets.forEach((set) => {
        let num = 0;
        set._difficultyBeatmaps.forEach((a) => {
            if (a._difficultyRank - num <= 0) {
                console.warn(a._difficulty + ' is unordered');
            }
            if (DifficultyRank[a._difficulty] !== a._difficultyRank) {
                console.error(a._difficulty + ' has invalid rank');
            }
            num = a._difficultyRank;
        });
        set._difficultyBeatmaps.sort((a, b) => b._difficultyRank - a._difficultyRank);
    });

    return infoData;
};
