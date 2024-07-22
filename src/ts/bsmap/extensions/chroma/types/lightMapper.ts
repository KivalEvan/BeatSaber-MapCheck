import type { IChromaEventLight } from '../../../types/beatmap/v3/custom/chroma.ts';
import type { Easings } from '../../../types/easings.ts';

export type DistributionType = 'Division' | 'Step and Offset';

export interface IndexFilterBase {
   type: DistributionType;
   reverse: boolean;
}

export interface IndexFilterDivision extends IndexFilterBase {
   type: 'Division';
   divide: number;
   id: number;
}

export interface IndexFilterStep extends IndexFilterBase {
   type: 'Step and Offset';
   id: number;
   step: number;
}

export type IndexFilter = IndexFilterDivision | IndexFilterStep;

export interface EventBase {
   time: number;
   /**
    * Color `<int>` of event.
    * ```ts
    * 0 -> Red
    * 1 -> Blue
    * 2 -> White
    * ```
    */
   color: 0 | 1 | 2;
   /**
    * Transition type `<int>` of event.
    * ```ts
    * 0 -> Instant
    * 1 -> Interpolate
    * 2 -> Extend
    * 3 -> Flash
    * 4 -> Fade
    * ```
    */
   transition: 0 | 1 | 2 | 3 | 4;
   brightness: number;
   frequency: number;
   customData: IChromaEventLight;
}

export interface EventBox {
   indexFilter: IndexFilter;
   beatDistribution: number;
   beatDistributionType: DistributionType;
   beatDistributionEasing: Easings;
   brightnessDistribution: number;
   brightnessDistributionType: DistributionType;
   brightnessDistributionEasing: Easings;
   hueDistribution: number;
   hueDistributionType: DistributionType;
   hueDistributionEasing: Easings;
   affectFirst: boolean;
   events: EventBase[];
}

export interface EventBoxType {
   time: number;
   type: number;
   lightID: number[];
   eventBox: EventBox[];
}
