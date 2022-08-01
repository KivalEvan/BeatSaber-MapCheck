import { IBookmark } from './bookmark';
import { IBPMChange, IBPMChangeOld } from '../shared/bpm';
import { IChromaCustomData, IChromaNote, IChromaObstacle } from './chroma';
import { INENote, INEObstacle } from './noodleExtensions';
import { ICustomDataBase } from '../shared/customData';
import { IPointDefinition } from './pointDefinition';
import { ICustomEvent } from './customEvent';
import { IAnimation } from './animation';

/** Custom Data interface for difficulty file.
 * @extends ICustomDataBase
 * @extends IChromaCustomData
 */
export interface ICustomDataDifficulty extends ICustomDataBase, IChromaCustomData {
    _customEvents?: ICustomEvent[];
    _pointDefinitions?: IPointDefinition[];
    _time?: number;
    _bpmChanges?: IBPMChangeOld[];
    _BPMChanges?: IBPMChange[];
    _bookmarks?: IBookmark[];
}

export type ICustomDataNote = ICustomDataBase & IChromaNote & INENote & IAnimation;
export type ICustomDataObstacle = ICustomDataBase & IChromaObstacle & INEObstacle & IAnimation;
