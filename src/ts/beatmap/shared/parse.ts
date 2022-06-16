import { IInfoData } from '../../types';
import { CharacteristicOrder } from './characteristic';
import Logger from '../../logger';
import { DifficultyRanking } from './difficulty';

const tag = (name: string) => {
    return `[shared::parse::${name}]`;
};

// TODO: more error check
// TODO: contemplate whether to make pure function or keep as is
export function info(infoData: IInfoData): IInfoData {
    Logger.info(tag('info'), 'Parsing beatmap info v2.x.x');
    infoData._difficultyBeatmapSets.sort(
        (a, b) => CharacteristicOrder[a._beatmapCharacteristicName] - CharacteristicOrder[b._beatmapCharacteristicName],
    );
    infoData._difficultyBeatmapSets.forEach((set) => {
        let num = 0;
        set._difficultyBeatmaps.forEach((a) => {
            if (a._difficultyRank - num <= 0) {
                Logger.warn(tag('info'), a._difficulty + ' is unordered');
            }
            if (DifficultyRanking[a._difficulty] !== a._difficultyRank) {
                Logger.error(tag('info'), a._difficulty + ' has invalid rank');
            }
            num = a._difficultyRank;
        });
        set._difficultyBeatmaps.sort((a, b) => a._difficultyRank - b._difficultyRank);
    });

    return infoData;
}
