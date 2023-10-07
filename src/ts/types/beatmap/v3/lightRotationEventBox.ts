import { IEventBox } from './eventBox';
import { ILightRotationBase } from './lightRotationBase';

export interface ILightRotationEventBox extends IEventBox {
   /** Rotation distribution `<float>` of light rotation event box. */
   s: number;
   /**
    * Rotation distribution type `<int>` of light rotation event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   t: 1 | 2;
   /**
    * Axis `<int>` of light rotation event box.
    * ```ts
    * 0 -> X
    * 1 -> Y
    * 2 -> Z
    * ```
    */
   a: 0 | 1 | 2;
   /** Flip rotation `<int>` in light rotation event box. */
   r: 0 | 1;
   /** Rotation distribution should affect first event `<int>` of light rotation event box. */
   b: 0 | 1;
   /** Light rotation base data list. */
   l: ILightRotationBase[];
}
