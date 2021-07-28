import { MapSetData } from './beatmap/map';
import { Contributor } from './beatmap/contributor';
import { BeatmapInfo } from './beatmap/info';
import { BPMChange } from './beatmap/bpm';

// TODO: structure bpm change for certain use
interface SavedData {
    _mapInfo?: BeatmapInfo;
    _mapSet?: MapSetData[];
    _contributors?: Contributor[];
    _analysis?: any;
    _duration?: number;
    _bpmChanges?: BPMChange[];
}

let savedData: SavedData = {};

// FIXME: kinda cheap solution, but idk if it's problematic?
export const clearData = (): void => {
    savedData = {};
};

export default savedData;
