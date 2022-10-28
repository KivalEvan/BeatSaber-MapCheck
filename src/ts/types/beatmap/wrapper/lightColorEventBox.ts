import { IWrapEventBox } from './eventBox';
import { IWrapLightColorBase } from './lightColorBase';

export interface IWrapLightColorEventBox extends IWrapEventBox {
    /** Brightness distribution `<float>` of light color event box.
     *
     * Range: `0-1` (0% to 100%), can be more than 1.
     */
    brightnessDistribution: number;
    /** Brightness distribution type `<int>` of light color event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    brightnessDistributionType: 1 | 2;
    /** Brightness distribution should affect first event `<int>` of light color event box. */
    affectFirst: 0 | 1;
    /** Light color base data list. */
    events: IWrapLightColorBase[];

    setBrightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']): this;
    setBrightnessDistributionType(value: IWrapLightColorEventBox['brightnessDistributionType']): this;
    setAffectFirst(value: IWrapLightColorEventBox['affectFirst']): this;
    setEvents(value: IWrapLightColorEventBox['events']): this;
}
