import { IHeckCustomEvent } from './heck';
import { IChromaCustomEvent } from './chroma';
import { INECustomEvent } from './noodleExtensions';

export type ICustomEvent = IHeckCustomEvent | IChromaCustomEvent | INECustomEvent;
