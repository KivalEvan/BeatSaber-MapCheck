import { MapData } from './beatmap';
import { Contributor } from './beatmap/contributor';
import { BeatmapInfo } from './beatmap/info';

interface SavedData {
    _mapInfo?: BeatmapInfo;
    _mapData?: MapData[];
    _contributors?: Contributor[];
    _analysis?: any;
    [key: string]: any;
}

const savedData: SavedData = {};
export default savedData;
