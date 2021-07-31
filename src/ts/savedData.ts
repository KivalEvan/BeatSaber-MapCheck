import { BeatmapSetData } from './beatmap/map';
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

let savedData: SavedData = {};

// FIXME: kinda cheap solution, but idk if it's problematic?
export const clearData = (): void => {
    savedData = {};
};

export default savedData;
