import { IWrapEventBox } from './eventBox';
import { IWrapLightRotationBase } from './lightRotationBase';

export interface IWrapLightRotationEventBox extends IWrapEventBox {
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
    /** Light rotation base data list. */
    events: IWrapLightRotationBase[];

    setRotationDistribution(value: IWrapLightRotationEventBox['rotationDistribution']): this;
    setRotationDistributionType(value: IWrapLightRotationEventBox['rotationDistributionType']): this;
    setAxis(value: IWrapLightRotationEventBox['axis']): this;
    setFlip(value: IWrapLightRotationEventBox['flip']): this;
    setAffectFirst(value: IWrapLightRotationEventBox['affectFirst']): this;
    setEvents(value: IWrapLightRotationEventBox['events']): this;
}
