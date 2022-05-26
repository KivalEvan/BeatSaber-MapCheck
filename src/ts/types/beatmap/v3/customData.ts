import { IBookmark } from '../shared/bookmark';
import { IBPMChange } from '../shared/bpm';
import { IHeckCustomData } from './heck';
import { IChromaCustomData, IChromaNote, IChromaObstacle } from './chroma';
import { INENote, INEObstacle } from './noodleExtensions';
import { ICustomEvent } from './customEvent';
import { ICustomDataBase } from '../shared/customData';

/** Custom Data interface for difficulty file.
 * ```ts
 * time?: float,
 * BPMChanges?: BPMChange[];
 * bookmarks?: Bookmark[];
 * ```
 * @extends CustomData
 * @extends CCustomData
 * @extends INECustomData
 */
export interface ICustomDataDifficulty extends ICustomDataBase, IHeckCustomData, IChromaCustomData {
    customEvents?: ICustomEvent[];
    time?: number;
    BPMChanges?: IBPMChange[];
    bookmarks?: IBookmark[];
}

export type ICustomDataNote = ICustomDataBase & IChromaNote & INENote;
export type ICustomDataObstacle = ICustomDataBase & IChromaObstacle & INEObstacle;
