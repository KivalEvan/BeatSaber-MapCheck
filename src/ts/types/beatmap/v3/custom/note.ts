import { ICustomDataBase } from '../../shared/custom/customData';
import { IAnimation } from './animation';
import { IChromaNote } from './chroma';
import { IHeckBase } from './heck';
import { INENote } from './noodleExtensions';

export type ICustomDataNote = ICustomDataBase & IHeckBase & IChromaNote & INENote & IAnimation;
