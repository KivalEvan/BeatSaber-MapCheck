import { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox';
import {
    IWrapLightTranslationBase,
    IWrapLightTranslationBaseAttribute,
} from './lightTranslationBase';

export interface IWrapLightTranslationEventBoxAttribute<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxAttribute<TBox, TBase, TFilter> {
    /** Translation distribution `<float>` of light translation event box. */
    translationDistribution: number;
    /** Translation distribution type `<int>` of light translation event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    translationDistributionType: 1 | 2;
    /** Axis `<int>` of light translation event box.
     * ```ts
     * 0 -> X
     * 1 -> Y
     * 2 -> Z
     * ```
     */
    axis: 0 | 1 | 2;
    /** Flip translation `<int>` in light translation event box. */
    flip: 0 | 1;
    /** Translation distribution should affect first event `<int>` of light translation event box. */
    affectFirst: 0 | 1;
    events: IWrapLightTranslationBaseAttribute<TBase>[];
}

export interface IWrapLightTranslationEventBox<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBox<TBox, TBase, TFilter>,
        IWrapLightTranslationEventBoxAttribute<TBox, TBase, TFilter> {
    events: IWrapLightTranslationBase<TBase>[];

    setTranslationDistribution(
        value: IWrapLightTranslationEventBox['translationDistribution'],
    ): this;
    setTranslationDistributionType(
        value: IWrapLightTranslationEventBox['translationDistributionType'],
    ): this;
    setAxis(value: IWrapLightTranslationEventBox['axis']): this;
    setFlip(value: IWrapLightTranslationEventBox['flip']): this;
    setAffectFirst(value: IWrapLightTranslationEventBox['affectFirst']): this;
    setEvents(value: IWrapLightTranslationBase<TBase>[]): this;
}
