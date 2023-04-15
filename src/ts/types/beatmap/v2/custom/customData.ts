import { IBookmark } from './bookmark';
import { IBPMChange, IBPMChangeOld } from './bpmChange';
import { IChromaCustomData, IChromaNote, IChromaObstacle } from './chroma';
import { INENote, INEObstacle } from './noodleExtensions';
import { ICustomDataBase } from '../../shared/custom/customData';
import { IPointDefinition } from './pointDefinition';
import { ICustomEvent } from './customEvent';
import { IAnimation } from './animation';
import { IHeckBase } from './heck';

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

export type ICustomDataNote = ICustomDataBase & IHeckBase & IChromaNote & INENote & IAnimation;
export type ICustomDataObstacle = ICustomDataBase &
    IHeckBase &
    IChromaObstacle &
    INEObstacle &
    IAnimation;
