import { IFxEventFloat } from './fxEventFloat';
import { IFxEventInt } from './fxEventInt';

export interface IFxEventsCollection {
   _fl?: IFxEventFloat[];
   _il?: IFxEventInt[];
}
