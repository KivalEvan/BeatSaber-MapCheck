import { IBookmark } from './bookmark';
import { IBPMChange } from './bpmChange';
import { IHeckCustomData } from './heck';
import { IChromaCustomData } from './chroma';
import { ICustomEvent } from './customEvent';
import { ICustomDataBase } from '../../shared/custom/customData';
import { IPointDefinition } from './pointDefinition';
import { IColorNote } from '../colorNote';
import { IChain } from '../chain';
import { IBombNote } from '../bombNote';
import { IObstacle } from '../obstacle';

/**
 * Custom Data interface for difficulty file.
 * @extends ICustomDataBase
 * @extends IHeckCustomData
 * @extends IChromaCustomData
 */
export interface ICustomDataDifficulty extends ICustomDataBase, IHeckCustomData, IChromaCustomData {
   fakeColorNotes?: IColorNote[];
   fakeBurstSliders?: IChain[];
   fakeBombNotes?: IBombNote[];
   fakeObstacles?: IObstacle[];
   customEvents?: ICustomEvent[];
   pointDefinitions?: IPointDefinition;
   time?: number;
   BPMChanges?: IBPMChange[];
   bookmarks?: IBookmark[];
}
