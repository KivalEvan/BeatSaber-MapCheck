import { NoteDirectionAngle } from '../shared/constants';
import { WrapGridObject } from './gridObject';
import { IWrapBaseNote } from '../../types/beatmap/wrapper/baseNote';

/** Color note beatmap class object. */
export abstract class WrapBaseNote<T extends Record<keyof T, unknown>>
    extends WrapGridObject<T>
    implements IWrapBaseNote<T>
{
    abstract get color(): IWrapBaseNote['color'];
    abstract set color(value: IWrapBaseNote['color']);
    abstract get direction(): IWrapBaseNote['direction'];
    abstract set direction(value: IWrapBaseNote['direction']);

    setColor(value: IWrapBaseNote['color']) {
        this.color = value;
        return this;
    }
    setDirection(value: IWrapBaseNote['direction']) {
        this.direction = value;
        return this;
    }

    isRed() {
        return this.color === 0;
    }

    isBlue() {
        return this.color === 1;
    }

    mirror(flipColor = true) {
        if (flipColor) {
            this.color = ((1 + this.color) % 2) as typeof this.color;
        }
        switch (this.direction) {
            case 2:
                this.direction = 3;
                break;
            case 3:
                this.direction = 2;
                break;
            case 6:
                this.direction = 7;
                break;
            case 7:
                this.direction = 6;
                break;
            case 4:
                this.direction = 5;
                break;
            case 5:
                this.direction = 4;
                break;
        }
        return super.mirror(flipColor);
    }

    swapRotation(toSwap: IWrapBaseNote, _ = true) {
        const tempD = toSwap.direction;
        toSwap.direction = this.direction;
        this.direction = tempD;
        return this;
    }

    getAngle(type?: 'vanilla' | 'me' | 'ne') {
        switch (type) {
            case 'vanilla':
                return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
            case 'me':
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
            /* falls through */
            case 'ne':
                return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
            default:
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
                return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
        }
    }

    isDouble(compareTo: IWrapBaseNote, tolerance = 0.01) {
        return (
            compareTo.time > this.time - tolerance &&
            compareTo.time < this.time + tolerance &&
            this.color !== compareTo.color
        );
    }

    isValidDirection() {
        return this.direction >= 0 && this.direction <= 8;
    }

    isValid() {
        return !this.isMappingExtensions() && this.isValidDirection();
    }
}
