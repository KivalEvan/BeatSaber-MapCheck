import { IBaseObject } from './baseObject';

export interface IBPMEvent extends IBaseObject {
   /** Value `<float>` of BPM change event. */
   m: number;
}
