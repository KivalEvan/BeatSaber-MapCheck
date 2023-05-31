import { ICustomDataBase } from '../../shared/custom/customData';
import { IAnimation } from './animation';
import { IChromaNote } from './chroma';
import { IHeckBase } from './heck';
import { INESlider } from './noodleExtensions';

export type ICustomDataSlider = ICustomDataBase & IHeckBase & IChromaNote & INESlider & IAnimation;
