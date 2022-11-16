import { WrapBaseSlider } from './baseSlider';
import { IWrapBurstSlider } from '../../types/beatmap/wrapper/burstSlider';

/** Burst slider beatmap class object.
 *
 * Also known as chain.
 */
export abstract class WrapBurstSlider<T extends Record<keyof T, unknown>>
    extends WrapBaseSlider<T>
    implements IWrapBurstSlider<T>
{
    abstract get sliceCount(): IWrapBurstSlider['sliceCount'];
    abstract set sliceCount(value: IWrapBurstSlider['sliceCount']);
    abstract get squish(): IWrapBurstSlider['squish'];
    abstract set squish(value: IWrapBurstSlider['squish']);

    setSliceCount(value: IWrapBurstSlider['sliceCount']) {
        this.sliceCount = value;
        return this;
    }
    setSquish(value: IWrapBurstSlider['squish']) {
        this.squish = value;
        return this;
    }

    isMappingExtensions() {
        return (
            this.posY > 2 ||
            this.posY < 0 ||
            this.posX <= -1000 ||
            this.posX >= 1000 ||
            (this.direction >= 1000 && this.direction <= 1360)
        );
    }

    isValid() {
        return (
            !(
                this.isMappingExtensions() ||
                this.isInverse() ||
                this.posX < 0 ||
                this.posX > 3 ||
                this.tailPosX < 0 ||
                this.tailPosX > 3
            ) && !(this.posX === this.tailPosX && this.posY === this.tailPosY)
        );
    }
}
