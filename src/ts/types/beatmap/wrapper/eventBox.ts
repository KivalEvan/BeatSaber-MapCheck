// deno-lint-ignore-file no-explicit-any
import { IWrapBaseItem, IWrapBaseItemAttribute } from './baseItem';
import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';
import { IWrapIndexFilter, IWrapIndexFilterAttribute } from './indexFilter';

export interface IWrapEventBoxAttribute<
    TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
    TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
    TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
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
    TBox extends { [P in keyof TBox]: TBox[P] } = Record<string, any>,
    TBase extends { [P in keyof TBase]: TBase[P] } = Record<string, any>,
    TFilter extends { [P in keyof TFilter]: TFilter[P] } = Record<string, any>,
> extends IWrapBaseItem<TBox>,
        IWrapEventBoxAttribute<TBox, TBase, TFilter> {
    events: IWrapBaseObject<TBase>[];

    setFilter(value: IWrapIndexFilter<TFilter>): this;
    setBeatDistribution(value: IWrapEventBox['beatDistribution']): this;
    setBeatDistributionType(value: IWrapEventBox['beatDistributionType']): this;
    setEasing(value: IWrapEventBox['easing']): this;
    setEvents(value: IWrapBaseObject<TBase>[]): this;
}
