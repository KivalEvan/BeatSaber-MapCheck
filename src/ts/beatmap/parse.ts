import { BPMChange } from './bpm';
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

// TODO: deal with and save BPM changes
export const map = (
    difficultyData: BeatmapData,
    difficultyName: DifficultyName,
    bpm: number
): BeatmapData => {
    const { _notes, _obstacles, _events, _customData } = difficultyData;
    _notes.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _notes object`
                );
            }
        }
    });
    _obstacles.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _obstacles object`
                );
            }
        }
    });
    _events.forEach((obj) => {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                throw new Error(
                    `${difficultyName} contain null or undefined value in _events object`
                );
            }
        }
    });
    _notes.sort((a, b) => a._time - b._time);
    _obstacles.sort((a, b) => a._time - b._time);
    _events.sort((a, b) => a._time - b._time);

    if (_customData) {
        const BPMChanges: BPMChange[] | undefined =
            _customData._BPMChanges || _customData._bpmChanges;
        if (BPMChanges && BPMChanges.length > 0) {
            BPMChanges.forEach((bpmc) => (bpmc._BPM = bpmc._bpm ?? bpmc._BPM));
            let minBPM = bpm,
                maxBPM = bpm;
            for (let i = 0, len = BPMChanges.length; i < len; i++) {
                if (BPMChanges[i]._BPM < minBPM) {
                    minBPM = BPMChanges[i]._BPM;
                }
                if (BPMChanges[i]._BPM > maxBPM) {
                    maxBPM = BPMChanges[i]._BPM;
                }
            }
        }
    }
    return difficultyData;
};
