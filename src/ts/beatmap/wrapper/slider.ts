import { WrapBaseSlider } from './baseSlider';
import { NoteDirectionAngle } from '../shared/constants';
import { IWrapSlider } from '../../types/beatmap/wrapper/slider';

/** Slider beatmap class object.
 *
 * Also known as arc.
 */
export abstract class WrapSlider<T extends Record<keyof T, unknown>>
    extends WrapBaseSlider<T>
    implements IWrapSlider<T>
{
    abstract get lengthMultiplier(): IWrapSlider['lengthMultiplier'];
    abstract set lengthMultiplier(value: IWrapSlider['lengthMultiplier']);
    abstract get tailLengthMultiplier(): IWrapSlider['tailLengthMultiplier'];
    abstract set tailLengthMultiplier(value: IWrapSlider['tailLengthMultiplier']);
    abstract get tailDirection(): IWrapSlider['tailDirection'];
    abstract set tailDirection(value: IWrapSlider['tailDirection']);
    abstract get midAnchor(): IWrapSlider['midAnchor'];
    abstract set midAnchor(value: IWrapSlider['midAnchor']);

    setLengthMultiplier(value: IWrapSlider['lengthMultiplier']) {
        this.lengthMultiplier = value;
        return this;
    }
    setTailLengthMultiplier(value: IWrapSlider['tailLengthMultiplier']) {
        this.tailLengthMultiplier = value;
        return this;
    }
    setTailDirection(value: IWrapSlider['tailDirection']) {
        this.tailDirection = value;
        return this;
    }
    setMidAnchor(value: IWrapSlider['midAnchor']) {
        this.midAnchor = value;
        return this;
    }

    mirror(flipColor = true) {
        switch (this.tailDirection) {
            case 2:
                this.tailDirection = 3;
                break;
            case 3:
                this.tailDirection = 2;
                break;
            case 6:
                this.tailDirection = 7;
                break;
            case 7:
                this.tailDirection = 6;
                break;
            case 4:
                this.tailDirection = 5;
                break;
            case 5:
                this.tailDirection = 4;
                break;
        }
        if (this.midAnchor) {
            this.midAnchor = this.midAnchor === 1 ? 2 : 1;
        }
        return super.mirror(flipColor);
    }

    getTailAngle(type?: 'vanilla' | 'me' | 'ne') {
        switch (type) {
            case 'vanilla':
                return (
                    NoteDirectionAngle[this.tailDirection as keyof typeof NoteDirectionAngle] || 0
                );
            case 'me':
                if (this.tailDirection >= 1000) {
                    return Math.abs(((this.tailDirection % 1000) % 360) - 360);
                }
            /* falls through */
            case 'ne':
                return (
                    NoteDirectionAngle[this.tailDirection as keyof typeof NoteDirectionAngle] || 0
                );
            default:
                if (this.tailDirection >= 1000) {
                    return Math.abs(((this.tailDirection % 1000) % 360) - 360);
                }
                return (
                    NoteDirectionAngle[this.tailDirection as keyof typeof NoteDirectionAngle] || 0
                );
        }
    }

    isMappingExtensions() {
        return (
            this.posY > 2 ||
            this.posY < 0 ||
            this.posX <= -1000 ||
            this.posX >= 1000 ||
            (this.direction >= 1000 && this.direction <= 1360) ||
            (this.tailDirection >= 1000 && this.tailDirection <= 1360)
        );
    }

    isValid() {
        return !(
            this.isMappingExtensions() ||
            this.isInverse() ||
            this.posX < 0 ||
            this.posX > 3 ||
            this.tailPosX < 0 ||
            this.tailPosX > 3 ||
            (this.posX === this.tailPosX &&
                this.posY === this.tailPosY &&
                this.time === this.tailTime)
        );
    }
}
