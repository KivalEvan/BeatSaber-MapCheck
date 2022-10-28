import { IBookmark } from './bookmark';
import { IBPMChange } from './bpmChange';
import { IHeckCustomData } from './heck';
import { IChromaCustomData, IChromaNote, IChromaObstacle } from './chroma';
import { INENote, INEObstacle, INESlider } from './noodleExtensions';
import { ICustomEvent } from './customEvent';
import { ICustomDataBase } from '../shared/customData';
import { IPointDefinition } from './pointDefinition';
import { IColorNote } from './colorNote';
import { IBurstSlider } from './burstSlider';
import { IBombNote } from './bombNote';
import { IObstacle } from './obstacle';
import { IAnimation } from './animation';

/** Custom Data interface for difficulty file.
 * @extends ICustomDataBase
 * @extends IHeckCustomData
 * @extends IChromaCustomData
 */
export interface ICustomDataDifficulty extends ICustomDataBase, IHeckCustomData, IChromaCustomData {
    fakeColorNotes?: IColorNote[];
    fakeBurstSliders?: IBurstSlider[];
    fakeBombNotes?: IBombNote[];
    fakeObstacles?: IObstacle[];
    customEvents?: ICustomEvent[];
    pointDefinitions?: IPointDefinition;
    time?: number;
    BPMChanges?: IBPMChange[];
    bookmarks?: IBookmark[];
}

export type ICustomDataNote = ICustomDataBase & IChromaNote & INENote & IAnimation;
export type ICustomDataSlider = ICustomDataBase & IChromaNote & INESlider & IAnimation;
export type ICustomDataObstacle = ICustomDataBase & IChromaObstacle & INEObstacle & IAnimation;
