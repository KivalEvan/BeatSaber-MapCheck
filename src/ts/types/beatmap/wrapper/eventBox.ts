import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';
import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';
import { IWrapIndexFilter, IWrapIndexFilterAttribute } from './indexFilter';

export interface IWrapEventBoxAttribute<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapBaseItemAttribute<TBox> {
    /** Index filter of event box. */
    filter: IWrapIndexFilterAttribute<TFilter>;
    /** Beat distribution `<float>` of event box. */
    beatDistribution: number;
    /** Beat distribution type `<int>` of event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    beatDistributionType: 1 | 2;
    /** Easing `<int>` of distribution.
     * ```ts
     * 0 -> Linear
     * 1 -> EaseInQuad
     * 2 -> EaseOutQuad
     * 3 -> EaseInOutQuad
     * ```
     */
    easing: 0 | 1 | 2 | 3;
    events: IWrapBaseObjectAttribute<TBase>[];
}

export interface IWrapEventBox<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapBaseItem<TBox>,
        IWrapEventBoxAttribute<TBox, TBase, TFilter> {
    events: IWrapBaseObject<TBase>[];

    setFilter(value: IWrapIndexFilter<TFilter>): this;
    setBeatDistribution(value: IWrapEventBox['beatDistribution']): this;
    setBeatDistributionType(value: IWrapEventBox['beatDistributionType']): this;
    setEasing(value: IWrapEventBox['easing']): this;
    setEvents(value: IWrapBaseObject<TBase>[]): this;
}
