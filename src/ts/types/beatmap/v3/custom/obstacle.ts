import { ICustomDataBase } from '../../shared/custom/customData';
import { IAnimation } from './animation';
import { IChromaObstacle } from './chroma';
import { IHeckBase } from './heck';
import { INEObstacle } from './noodleExtensions';

export type ICustomDataObstacle = ICustomDataBase &
   IHeckBase &
   IChromaObstacle &
   INEObstacle &
   IAnimation;
