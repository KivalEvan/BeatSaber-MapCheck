import { BeatmapSetData } from './beatmap/mapSet';
import { Contributor } from './beatmap/contributor';
import { BeatmapInfo } from './beatmap/info';
import { BPMChange } from './beatmap/bpm';
import { Analysis } from './tools/analysis';

// TODO: structure bpm change for certain use
interface SavedData {
    _mapInfo?: BeatmapInfo;
    _mapSet?: BeatmapSetData[];
    _contributors?: Contributor[];
    _analysis?: Analysis;
    _duration?: number;
    _bpmChanges?: BPMChange[];
}

const savedData: SavedData = {};

export const clearData = (): void => {
    for (const key in savedData) {
        delete savedData[key as keyof typeof savedData];
    }
};

export default savedData;
