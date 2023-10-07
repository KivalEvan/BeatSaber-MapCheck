import { IChromaAnimation } from './chroma';
import { INEAnimation } from './noodleExtensions';

export interface IAnimation {
   animation?: INEAnimation & IChromaAnimation;
}
