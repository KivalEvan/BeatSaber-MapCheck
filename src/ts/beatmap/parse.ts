import { CharacteristicOrder } from './characteristic';
import { DifficultyRank, DifficultyData } from './difficulty';
import { BeatmapInfo } from './info';
import { compare } from './version';
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
            mode._difficultyBeatmaps.sort(
                (a, b) => b._difficultyRank - a._difficultyRank
            );
        });
    }

    return mapInfo;
};

// FIXME: need more elegant solution
export const difficulty = (difficultyData: DifficultyData): DifficultyData => {
    const { _version, _notes, _obstacles, _events, _waypoints } = difficultyData;

    if (!_version) {
        console.error('missing version, applying 2.0.0');
        difficultyData._version = '2.0.0';
    }
    _notes.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null value in _notes object');
            }
            if (typeof obj._time === 'undefined') {
                throw new Error('missing _time in _notes object');
            }
            if (typeof obj._time !== 'number') {
                throw new Error('invalid type _time in _notes object');
            }
            if (typeof obj._type === 'undefined') {
                throw new Error('missing _type in _notes object');
            }
            if (typeof obj._type !== 'number') {
                throw new Error('invalid type _type in _notes object');
            }
            if (typeof obj._cutDirection === 'undefined') {
                throw new Error('missing _cutDirection in _notes object');
            }
            if (typeof obj._cutDirection !== 'number') {
                throw new Error('invalid type _cutDirection in _notes object');
            }
            if (typeof obj._lineIndex === 'undefined') {
                throw new Error('missing _lineIndex in _notes object');
            }
            if (typeof obj._lineIndex !== 'number') {
                throw new Error('invalid type _lineIndex in _notes object');
            }
            if (typeof obj._lineLayer === 'undefined') {
                throw new Error('missing _lineLayer in _notes object');
            }
            if (typeof obj._lineLayer !== 'number') {
                throw new Error('invalid type _lineLayer in _notes object');
            }
        }
    });
    _obstacles.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null value in _obstacles object');
            }
            if (typeof obj._time === 'undefined') {
                throw new Error('missing _time in _obstacles object');
            }
            if (typeof obj._time !== 'number') {
                throw new Error('invalid type _time in _obstacles object');
            }
            if (typeof obj._type === 'undefined') {
                throw new Error('missing _type in _obstacles object');
            }
            if (typeof obj._type !== 'number') {
                throw new Error('invalid type _type in _obstacles object');
            }
            if (typeof obj._duration === 'undefined') {
                throw new Error('missing _duration in _obstacles object');
            }
            if (typeof obj._duration !== 'number') {
                throw new Error('invalid type _duration in _obstacles object');
            }
            if (typeof obj._lineIndex === 'undefined') {
                throw new Error('missing _lineIndex in _obstacles object');
            }
            if (typeof obj._lineIndex !== 'number') {
                throw new Error('invalid type _lineIndex in _obstacles object');
            }
            if (typeof obj._width === 'undefined') {
                throw new Error('missing _width in _obstacles object');
            }
            if (typeof obj._width !== 'number') {
                throw new Error('invalid type _width in _obstacles object');
            }
        }
    });
    _events.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null) {
                throw new Error('contain null value in _events object');
            }
            if (typeof obj._time === 'undefined') {
                throw new Error('missing _time in _events object');
            }
            if (typeof obj._time !== 'number') {
                throw new Error('invalid type _time in _events object');
            }
            if (typeof obj._type === 'undefined') {
                throw new Error('missing _type in _events object');
            }
            if (typeof obj._type !== 'number') {
                throw new Error('invalid type _type in _events object');
            }
            if (typeof obj._value === 'undefined') {
                throw new Error('missing _value in _events object');
            }
            if (typeof obj._value !== 'number') {
                throw new Error('invalid type _value in _events object');
            }
            if (compare(_version, 'difficulty') === 'old') {
                obj._floatValue = 1;
            } else {
                if (typeof obj._floatValue === 'undefined') {
                    throw new Error('missing _floatValue in _events object');
                }
                if (typeof obj._floatValue !== 'number') {
                    throw new Error('invalid _floatValue in _events object');
                }
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
