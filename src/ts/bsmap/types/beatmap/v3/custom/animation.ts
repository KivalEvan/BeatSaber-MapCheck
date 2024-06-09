import type { IChromaAnimation } from './chroma.ts';
import type { INEAnimation } from './noodleExtensions.ts';

export interface IAnimation {
   animation?: INEAnimation & IChromaAnimation;
}
