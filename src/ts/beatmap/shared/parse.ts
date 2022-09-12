import { IInfo } from '../../types/beatmap/shared/info';
import { CharacteristicOrder } from './characteristic';
import logger from '../../logger';
import { DifficultyRanking } from './difficulty';

const tag = (name: string) => {
    return `[shared::parse::${name}]`;
};

// TODO: more error check
// TODO: contemplate whether to make pure function or keep as is
export function info(infoData: IInfo): IInfo {
    logger.info(tag('info'), 'Parsing beatmap info v2.x.x');
    infoData._difficultyBeatmapSets.sort(
        (a, b) => CharacteristicOrder[a._beatmapCharacteristicName] - CharacteristicOrder[b._beatmapCharacteristicName],
    );
    infoData._difficultyBeatmapSets.forEach((set) => {
        let num = 0;
        set._difficultyBeatmaps.forEach((a) => {
            if (a._difficultyRank - num <= 0) {
                logger.warn(tag('info'), a._difficulty + ' is unordered');
            }
            if (DifficultyRanking[a._difficulty] !== a._difficultyRank) {
                logger.error(tag('info'), a._difficulty + ' has invalid rank');
            }
            num = a._difficultyRank;
            if (typeof a._customData?._editorOffset === 'number' && a._customData._editorOffset === 0) {
                delete a._customData._editorOffset;
            }
            if (typeof a._customData?._editorOldOffset === 'number' && a._customData._editorOldOffset === 0) {
                delete a._customData._editorOldOffset;
            }
        });
        set._difficultyBeatmaps.sort((a, b) => a._difficultyRank - b._difficultyRank);
    });

    return infoData;
}
