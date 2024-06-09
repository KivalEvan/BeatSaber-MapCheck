import type { IChromaAnimation } from './chroma.ts';
import type { INEAnimation } from './noodleExtensions.ts';

export interface IAnimation {
   _animation?: INEAnimation & IChromaAnimation;
}
