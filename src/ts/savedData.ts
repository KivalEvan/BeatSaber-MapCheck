import { MapDataSet } from './beatmap/map';
import { Contributor } from './beatmap/contributor';
import { BeatmapInfo } from './beatmap/info';

interface SavedData {
    _mapInfo?: BeatmapInfo;
    _mapData?: MapDataSet[];
    _contributors?: Contributor[];
    _analysis?: any;
    [key: string]: any;
}

const savedData: SavedData = {};
export default savedData;
