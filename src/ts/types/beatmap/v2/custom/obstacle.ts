import type { ICustomDataBase } from '../../shared/custom/customData.ts';
import type { IAnimation } from './animation.ts';
import type { IChromaObstacle } from './chroma.ts';
import type { IHeckBase } from './heck.ts';
import type { INEObstacle } from './noodleExtensions.ts';

export type ICustomDataObstacle = ICustomDataBase &
   IHeckBase &
   IChromaObstacle &
   INEObstacle &
   IAnimation;
