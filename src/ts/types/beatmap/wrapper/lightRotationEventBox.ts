import { IWrapEventBox, IWrapEventBoxAttribute } from './eventBox';
import { IWrapLightRotationBase, IWrapLightRotationBaseAttribute } from './lightRotationBase';

export interface IWrapLightRotationEventBoxAttribute<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBoxAttribute<TBox, TBase, TFilter> {
    /** Rotation distribution `<float>` of light rotation event box. */
    rotationDistribution: number;
    /** Rotation distribution type `<int>` of light rotation event box.
     * ```ts
     * 1 -> Wave // adds up to last ID.
     * 2 -> Step // adds to consequent ID.
     * ```
     */
    rotationDistributionType: 1 | 2;
    /** Axis `<int>` of light rotation event box.
     * ```ts
     * 0 -> X
     * 1 -> Y
     * 2 -> Z
     * ```
     */
    axis: 0 | 1 | 2;
    /** Flip rotation `<int>` in light rotation event box. */
    flip: 0 | 1;
    /** Rotation distribution should affect first event `<int>` of light rotation event box. */
    affectFirst: 0 | 1;
    events: IWrapLightRotationBaseAttribute<TBase>[];
}

export interface IWrapLightRotationEventBox<
    TBox extends Record<keyof TBox, unknown> = Record<string, unknown>,
    TBase extends Record<keyof TBase, unknown> = Record<string, unknown>,
    TFilter extends Record<keyof TFilter, unknown> = Record<string, unknown>,
> extends IWrapEventBox<TBox, TBase, TFilter>,
        IWrapLightRotationEventBoxAttribute<TBox, TBase, TFilter> {
    events: IWrapLightRotationBase<TBase>[];

    setRotationDistribution(value: IWrapLightRotationEventBox['rotationDistribution']): this;
    setRotationDistributionType(
        value: IWrapLightRotationEventBox['rotationDistributionType'],
    ): this;
    setAxis(value: IWrapLightRotationEventBox['axis']): this;
    setFlip(value: IWrapLightRotationEventBox['flip']): this;
    setAffectFirst(value: IWrapLightRotationEventBox['affectFirst']): this;
    setEvents(value: IWrapLightRotationBase<TBase>[]): this;
}
