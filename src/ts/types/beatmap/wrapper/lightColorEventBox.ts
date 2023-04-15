import { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox';
import { IWrapLightColorBase, IWrapLightColorBaseAttribute } from './lightColorBase';

export interface IWrapLightColorEventBoxAttribute<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxAttribute<TBox, TBase, TFilter> {
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
    events: IWrapLightColorBaseAttribute<TBase>[];
}

export interface IWrapLightColorEventBox<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBox<TBox, TBase, TFilter>,
        IWrapLightColorEventBoxAttribute<TBox, TBase, TFilter> {
    events: IWrapLightColorBase<TBase>[];

    setBrightnessDistribution(value: IWrapLightColorEventBox['brightnessDistribution']): this;
    setBrightnessDistributionType(
        value: IWrapLightColorEventBox['brightnessDistributionType'],
    ): this;
    setAffectFirst(value: IWrapLightColorEventBox['affectFirst']): this;
    setEvents(value: IWrapLightColorBase<TBase>[]): this;
}
