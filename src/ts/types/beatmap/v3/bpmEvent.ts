import type { IBaseObject } from './baseObject.ts';

export interface IBPMEvent extends IBaseObject {
   /** Value `<float>` of BPM change event. */
   m?: number;
}
