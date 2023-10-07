import { IBookmark } from './bookmark';
import { IBPMChange, IBPMChangeOld } from './bpmChange';
import { IChromaCustomData } from './chroma';
import { ICustomDataBase } from '../../shared/custom/customData';
import { IPointDefinition } from './pointDefinition';
import { ICustomEvent } from './customEvent';

/**
 * Custom Data interface for difficulty file.
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
