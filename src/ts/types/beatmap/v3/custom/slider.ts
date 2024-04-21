import type { ICustomDataBase } from '../../shared/custom/customData.ts';
import type { IAnimation } from './animation.ts';
import type { IChromaNote } from './chroma.ts';
import type { IHeckBase } from './heck.ts';
import type { INESlider } from './noodleExtensions.ts';

export type ICustomDataSlider = ICustomDataBase & IHeckBase & IChromaNote & INESlider & IAnimation;
