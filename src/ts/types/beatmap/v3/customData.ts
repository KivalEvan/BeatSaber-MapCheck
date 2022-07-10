import { IBookmark } from './bookmark';
import { IBPMChange } from '../shared/bpm';
import { IHeckCustomData } from './heck';
import { IChromaCustomData, IChromaNote, IChromaObstacle } from './chroma';
import { INENote, INEObstacle } from './noodleExtensions';
import { ICustomEvent } from './customEvent';
import { ICustomDataBase } from '../shared/customData';
import { IPointDefinition } from './pointDefinition';

/** Custom Data interface for difficulty file.
 * @extends CustomData
 * @extends CCustomData
 * @extends INECustomData
 */
export interface ICustomDataDifficulty extends ICustomDataBase, IHeckCustomData, IChromaCustomData {
    customEvents?: ICustomEvent[];
    pointDefinitions?: IPointDefinition[];
    time?: number;
    BPMChanges?: IBPMChange[];
    _bookmarks?: IBookmark[];
}

export type ICustomDataNote = ICustomDataBase & IChromaNote & INENote;
export type ICustomDataObstacle = ICustomDataBase & IChromaObstacle & INEObstacle;
