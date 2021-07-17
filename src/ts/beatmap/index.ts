import { BPMChange } from './bpm';
import { CharacteristicOrder } from './characteristic';
import { DifficultyName } from './difficulty';
import { BeatmapInfo, BeatmapSet } from './info';
import { BeatmapData } from './map';

// TODO: more error check
export const parseInfo = (mapInfo: BeatmapInfo): BeatmapInfo => {
    mapInfo._difficultyBeatmapSets.sort(
        (a, b) =>
            CharacteristicOrder[a._beatmapCharacteristicName] -
            CharacteristicOrder[b._beatmapCharacteristicName]
    );
    return mapInfo;
};

export const parseMap = (
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
        const BPMChanges: BPMChange[] = _customData._BPMChanges || _customData._bpmChanges;
        BPMChanges.forEach((bpmc) => (bpmc._BPM = bpmc._bpm ?? bpmc._BPM));
        if (BPMChanges && BPMChanges.length > 0) {
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
            difficultyData._information = {
                minBPM: minBPM,
                maxBPM: maxBPM,
            };
        }
    }
    return difficultyData;
};

interface MapData {
    mapInfo: BeatmapInfo | Object;
    mapDifficulty: BeatmapSet | Object;
}

const mapData: MapData = {
    mapInfo: {},
    mapDifficulty: {},
};

export default mapData;
