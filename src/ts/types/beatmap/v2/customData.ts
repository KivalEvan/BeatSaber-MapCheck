import { IBookmark } from './bookmark';
import { IBPMChange, IBPMChangeOld } from '../shared/bpm';
import { IHeckCustomData, IHeckCustomEvent } from './heck';
import { IChromaCustomData, IChromaCustomEvent, IChromaNote, IChromaObstacle } from './chroma';
import { INECustomData, INECustomEvent, INENote, INEObstacle } from './noodleExtensions';
import { ICustomDataBase } from '../shared/customData';

export type ICustomEvent = IHeckCustomEvent | IChromaCustomEvent | INECustomEvent;

/** Custom Data interface for difficulty file.
 * @extends CustomData
 * @extends CCustomData
 * @extends INECustomData
 */
export interface ICustomDataDifficulty
    extends ICustomDataBase,
        Omit<IHeckCustomData, '_customEvents'>,
        Omit<IChromaCustomData, '_customEvents'>,
        Omit<INECustomData, '_customEvents'> {
    _customEvents?: ICustomEvent[];
    _time?: number;
    _bpmChanges?: IBPMChangeOld[];
    _BPMChanges?: IBPMChange[];
    _bookmarks?: IBookmark[];
}

export type ICustomDataNote = ICustomDataBase & IChromaNote & INENote;
export type ICustomDataObstacle = ICustomDataBase & IChromaObstacle & INEObstacle;
