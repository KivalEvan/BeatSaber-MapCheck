import type { IFxEventFloat } from './fxEventFloat.ts';
import type { IFxEventInt } from './fxEventInt.ts';

export interface IFxEventsCollection {
   _fl?: IFxEventFloat[];
   _il?: IFxEventInt[];
}
