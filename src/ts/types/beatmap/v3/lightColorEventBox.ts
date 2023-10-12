import { IEventBox } from './eventBox';
import { ILightColorBase } from './lightColorBase';

export interface ILightColorEventBox extends IEventBox {
   /**
    * Brightness distribution `<float>` of light color event box.
    *
    * Percentage value `0-1` (0% to 100%), can be more than 1.
    */
   r: number;
   /**
    * Brightness distribution type `<int>` of light color event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   t: 1 | 2;
   /** Brightness distribution should affect first event `<int>` of light color event box. */
   b: 0 | 1;
   /** Light color base data list. */
   e: ILightColorBase[];
}
