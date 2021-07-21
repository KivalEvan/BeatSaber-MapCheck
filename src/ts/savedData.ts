import { MapDataSet } from './beatmap/map';
import { Contributor } from './beatmap/contributor';
import { BeatmapInfo } from './beatmap/info';
import { BPMChange } from './beatmap/bpm';

// TODO: structure bpm change for certain use
interface SavedData {
    _mapInfo?: BeatmapInfo;
    _mapData?: MapDataSet[];
    _contributors?: Contributor[];
    _analysis?: any;
    _bpmChanges?: BPMChange[];
    [key: string]: any;
}

const savedData: SavedData = {};
export default savedData;
