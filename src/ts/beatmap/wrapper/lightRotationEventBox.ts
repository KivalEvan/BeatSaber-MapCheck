import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { IWrapLightRotationBase } from '../../types/beatmap/wrapper/lightRotationBase';
import { IWrapLightRotationEventBox } from '../../types/beatmap/wrapper/lightRotationEventBox';
import { WrapEventBox } from './eventBox';

/** Light rotation event box beatmap class object. */
export abstract class WrapLightRotationEventBox<T extends Record<keyof T, unknown>>
    extends WrapEventBox<T>
    implements IWrapLightRotationEventBox
{
    abstract get rotationDistribution(): ILightRotationEventBox['s'];
    abstract set rotationDistribution(value: ILightRotationEventBox['s']);
    abstract get rotationDistributionType(): ILightRotationEventBox['t'];
    abstract set rotationDistributionType(value: ILightRotationEventBox['t']);
    abstract get axis(): ILightRotationEventBox['a'];
    abstract set axis(value: ILightRotationEventBox['a']);
    abstract get flip(): ILightRotationEventBox['r'];
    abstract set flip(value: ILightRotationEventBox['r']);
    abstract get affectFirst(): ILightRotationEventBox['b'];
    abstract set affectFirst(value: ILightRotationEventBox['b']);
    abstract get events(): IWrapLightRotationBase[];
    abstract set events(value: IWrapLightRotationBase[]);

    setRotationDistribution(value: IWrapLightRotationEventBox['rotationDistribution']) {
        this.rotationDistribution = value;
        return this;
    }
    setRotationDistributionType(value: IWrapLightRotationEventBox['rotationDistributionType']) {
        this.rotationDistributionType = value;
        return this;
    }
    setAxis(value: IWrapLightRotationEventBox['axis']) {
        this.axis = value;
        return this;
    }
    setFlip(value: IWrapLightRotationEventBox['flip']) {
        this.flip = value;
        return this;
    }
    setAffectFirst(value: IWrapLightRotationEventBox['affectFirst']) {
        this.affectFirst = value;
        return this;
    }
    abstract setEvents(value: IWrapLightRotationBase[]): this;

    isValid(): boolean {
        return (
            super.isValid() &&
            (this.rotationDistributionType === 1 || this.rotationDistributionType === 2) &&
            (this.axis === 0 || this.axis === 1) &&
            (this.flip === 0 || this.flip === 1) &&
            (this.affectFirst === 0 || this.affectFirst === 1)
        );
    }
}