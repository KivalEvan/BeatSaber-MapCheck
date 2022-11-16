import { IWrapBaseItem } from './baseItem';
import { IWrapBaseObject } from './baseObject';
import { IWrapIndexFilter } from './indexFilter';

export interface IWrapEventBox<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapBaseItem<TBox> {
    /** Index filter of event box. */
    filter: IWrapIndexFilter<TFilter>;
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
    /** Light base data list. */
    events: IWrapBaseObject<TBase>[];

    setFilter(value: IWrapIndexFilter<TFilter>): this;
    setBeatDistribution(value: IWrapEventBox['beatDistribution']): this;
    setBeatDistributionType(value: IWrapEventBox['beatDistributionType']): this;
    setEasing(value: IWrapEventBox['easing']): this;
    setEvents(value: IWrapBaseObject<TBase>[]): this;
}
