import { CharacteristicOrder } from './characteristic';
import { DifficultyName } from './difficulty';
import { BeatmapInfo } from './info';
import { BeatmapData } from './map';

// TODO: more error check
// TODO: contemplate whether to make pure function or keep as is
export const info = (mapInfo: BeatmapInfo): BeatmapInfo => {
    mapInfo._difficultyBeatmapSets.sort(
        (a, b) =>
            CharacteristicOrder[a._beatmapCharacteristicName] -
            CharacteristicOrder[b._beatmapCharacteristicName]
    );
    mapInfo._difficultyBeatmapSets.forEach((mode) => {
        mode._difficultyBeatmaps.sort((a, b) => b._difficultyRank - a._difficultyRank);
    });

    return mapInfo;
};

export const map = (difficultyData: BeatmapData, difficultyName: DifficultyName): BeatmapData => {
    const { _notes, _obstacles, _events, _waypoints } = difficultyData;
    _notes.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null or undefined value in _notes object');
            }
        }
    });
    _obstacles.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null or undefined value in _obstacles object');
            }
        }
    });
    _events.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null or undefined value in _events object');
            }
        }
    });
    _waypoints?.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null or undefined value in _waypoints object');
            }
        }
    });
    _notes.sort((a, b) => a._time - b._time);
    _obstacles.sort((a, b) => a._time - b._time);
    _events.sort((a, b) => a._time - b._time);

    return difficultyData;
};
