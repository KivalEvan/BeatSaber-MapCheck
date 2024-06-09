import type { IBookmark } from './bookmark.ts';
import type { IBPMChange, IBPMChangeOld } from './bpmChange.ts';
import type { IChromaCustomData } from './chroma.ts';
import type { ICustomDataBase } from '../../shared/custom/customData.ts';
import type { IPointDefinition } from './pointDefinition.ts';
import type { ICustomEvent } from './customEvent.ts';

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
