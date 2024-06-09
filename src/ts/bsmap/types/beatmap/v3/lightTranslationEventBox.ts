import type { DistributionType } from '../shared/constants.ts';
import type { Axis } from '../shared/constants.ts';
import type { IEventBox } from './eventBox.ts';
import type { ILightTranslationEvent } from './lightTranslationEvent.ts';

export interface ILightTranslationEventBox extends IEventBox {
   /** Translation distribution `<float>` of light translation event box. */
   s?: number;
   /**
    * Translation distribution type `<int>` of light translation event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   t?: DistributionType;
   /**
    * Axis `<int>` of light translation event box.
    * ```ts
    * 0 -> X
    * 1 -> Y
    * 2 -> Z
    * ```
    */
   a?: Axis;
   /** Flip translation `<int>` in light translation event box. */
   r?: 0 | 1;
   /** Translation distribution should affect first event `<int>` of light translation event box. */
   b?: 0 | 1;
   /** Light translation base data list. */
   l?: ILightTranslationEvent[];
}
