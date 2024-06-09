import type { DistributionType } from '../shared/constants.ts';
import type { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox.ts';
import type { IWrapLightColorEvent, IWrapLightColorEventAttribute } from './lightColorEvent.ts';

export interface IWrapLightColorEventBoxAttribute extends IWrapEventBoxAttribute {
   /**
    * Brightness distribution `<float>` of light color event box.
    *
    * Percentage value `0-1` (0% to 100%), can be more than 1.
    */
   brightnessDistribution: number;
   /**
    * Brightness distribution type `<int>` of light color event box.
    * ```ts
    * 1 -> Wave // adds up to last ID.
    * 2 -> Step // adds to consequent ID.
    * ```
    */
   brightnessDistributionType: DistributionType;
   events: IWrapLightColorEventAttribute[];
}

export interface IWrapLightColorEventBox extends IWrapEventBox, IWrapLightColorEventBoxAttribute {
   events: IWrapLightColorEvent[];

   setBrightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']): this;
   setBrightnessDistributionType(
      value: IWrapLightColorEventBox['brightnessDistributionType'],
   ): this;
   setAffectFirst(value: IWrapLightColorEventBox['affectFirst']): this;
   setEvents(value: IWrapLightColorEvent[]): this;
}
