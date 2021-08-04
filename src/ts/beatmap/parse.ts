import { CharacteristicOrder } from './characteristic';
import { DifficultyRank } from './difficulty';
import { BeatmapInfo } from './info';
import { BeatmapData } from './map';
import settings from '../settings';

// TODO: more error check
// TODO: contemplate whether to make pure function or keep as is
export const info = (mapInfo: BeatmapInfo): BeatmapInfo => {
    if (settings.sorting) {
        mapInfo._difficultyBeatmapSets.sort(
            (a, b) =>
                CharacteristicOrder[a._beatmapCharacteristicName] -
                CharacteristicOrder[b._beatmapCharacteristicName]
        );
        mapInfo._difficultyBeatmapSets.forEach((mode) => {
            let num = 0;
            mode._difficultyBeatmaps.forEach((a) => {
                if (a._difficultyRank - num <= 0) {
                    console.error(a._difficulty + ' may be unordered');
                }
                if (DifficultyRank[a._difficulty] !== a._difficultyRank) {
                    console.error(a._difficulty + ' has invalid rank');
                }
                num = a._difficultyRank;
            });
            mode._difficultyBeatmaps.sort((a, b) => b._difficultyRank - a._difficultyRank);
        });
    }

    return mapInfo;
};

export const difficulty = (difficultyData: BeatmapData): BeatmapData => {
    const { _notes, _obstacles, _events, _waypoints } = difficultyData;
    _notes.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null value in _notes object');
            }
        }
    });
    _obstacles.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null value in _obstacles object');
            }
        }
    });
    _events.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null value in _events object');
            }
        }
    });
    _waypoints?.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null value in _waypoints object');
            }
        }
    });
    if (settings.sorting) {
        _notes.sort((a, b) => a._time - b._time);
        _obstacles.sort((a, b) => a._time - b._time);
        _events.sort((a, b) => a._time - b._time);
        _waypoints?.sort((a, b) => a._time - b._time);
    }

    return difficultyData;
};
