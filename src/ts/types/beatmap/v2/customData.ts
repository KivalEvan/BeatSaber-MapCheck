import { IBookmark } from './bookmark';
import { IBPMChange, IBPMChangeOld } from '../shared/bpm';
import { IHeckCustomData, IHeckCustomEvent } from './heck';
import {
    IChromaCustomData,
    IChromaCustomEvent,
    IChromaNote,
    IChromaObstacle,
} from './chroma';
import {
    INECustomData,
    INECustomEvent,
    INENote,
    INEObstacle,
} from './noodleExtensions';

/** Base custom data interface. */
export interface ICustomData {
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
}

export type ICustomEvent = IHeckCustomEvent | IChromaCustomEvent | INECustomEvent;

/** Custom Data interface for difficulty file.
 * ```ts
 * _time?: float,
 * _bpmChanges?: BPMChange[];
 * _BPMChanges?: BPMChange[];
 * _bookmarks?: Bookmark[];
 * ```
 * @extends ICustomData
 * @extends CCustomData
 * @extends INECustomData
 */
export interface ICustomDataDifficulty
    extends ICustomData,
        Omit<IHeckCustomData, '_customEvents'>,
        Omit<IChromaCustomData, '_customEvents'>,
        Omit<INECustomData, '_customEvents'> {
    _customEvents?: ICustomEvent[];
    _time?: number;
    _bpmChanges?: IBPMChangeOld[];
    _BPMChanges?: IBPMChange[];
    _bookmarks?: IBookmark[];
}

export type ICustomDataNote = ICustomData & IChromaNote & INENote;
export type ICustomDataObstacle = ICustomData & IChromaObstacle & INEObstacle;
