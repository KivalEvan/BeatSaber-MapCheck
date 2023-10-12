import { IChromaAnimation } from './chroma';
import { INEAnimation } from './noodleExtensions';

export interface IAnimation {
   _animation?: INEAnimation & IChromaAnimation;
}
