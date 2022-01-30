import { BeatmapSetData } from './beatmap/types/set';
import { Contributor } from './beatmap/types/contributor';
import { InfoData } from './beatmap/types/info';
import { BPMChange } from './beatmap/types/bpm';
import { Analysis } from './tools/analysis';

// TODO: structure bpm change for certain use
interface SavedData {
    _mapInfo?: InfoData;
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
