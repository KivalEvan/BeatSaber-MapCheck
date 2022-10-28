import { LINE_COUNT, NoteDirectionAngle } from '../shared/constants';
import { IWrapBaseSlider } from '../../types/beatmap/wrapper/baseSlider';
import { IWrapGridObject } from '../../types/beatmap/wrapper/gridObject';
import { WrapBaseNote } from './baseNote';

/** Base slider beatmap class object. */
export abstract class WrapBaseSlider<T extends Record<keyof T, unknown>>
    extends WrapBaseNote<T>
    implements IWrapBaseSlider
{
    abstract get tailTime(): IWrapBaseSlider['tailTime'];
    abstract set tailTime(value: IWrapBaseSlider['tailTime']);
    abstract get tailPosX(): IWrapBaseSlider['tailPosX'];
    abstract set tailPosX(value: IWrapBaseSlider['tailPosX']);
    abstract get tailPosY(): IWrapBaseSlider['tailPosY'];
    abstract set tailPosY(value: IWrapBaseSlider['tailPosY']);

    setTailTime(value: IWrapBaseSlider['tailTime']) {
        this.tailTime = value;
        return this;
    }
    setTailPosX(value: IWrapBaseSlider['tailPosX']) {
        this.tailPosX = value;
        return this;
    }
    setTailPosY(value: IWrapBaseSlider['tailPosY']) {
        this.tailPosY = value;
        return this;
    }

    mirror(flipColor = true) {
        this.tailPosX = LINE_COUNT - 1 - this.tailPosX;
        return super.mirror(flipColor);
    }

    getTailPosition(type?: 'vanilla' | 'me' | 'ne'): [number, number] {
        switch (type) {
            case 'vanilla':
                return [this.tailPosX, this.tailPosY];
            case 'me':
                return [
                    (this.tailPosX <= -1000
                        ? this.tailPosX / 1000
                        : this.tailPosX >= 1000
                        ? this.tailPosX / 1000
                        : this.tailPosX) - 2,
                    this.tailPosY <= -1000
                        ? this.tailPosY / 1000
                        : this.tailPosY >= 1000
                        ? this.tailPosY / 1000
                        : this.tailPosY,
                ];
            case 'ne':
                return [this.tailPosX, this.tailPosY];
            default:
                return [
                    (this.tailPosX <= -1000
                        ? this.tailPosX / 1000
                        : this.tailPosX >= 1000
                        ? this.tailPosX / 1000
                        : this.tailPosX) - 2,
                    this.tailPosY <= -1000
                        ? this.tailPosY / 1000
                        : this.tailPosY >= 1000
                        ? this.tailPosY / 1000
                        : this.tailPosY,
                ];
        }
    }

    /** Get arc and return standardised note angle.
     * ```ts
     * const arcAngle = arc.getAngle();
     * ```
     */
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
        }
        if (this.direction >= 1000) {
            return Math.abs(((this.direction % 1000) % 360) - 360);
        }
        return NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0;
    }

    getDistance(compareTo: IWrapGridObject) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
    }

    isVertical(compareTo: IWrapGridObject) {
        const [nX1] = this.getPosition();
        const [nX2] = compareTo.getPosition();
        const d = nX1 - nX2;
        return d > -0.001 && d < 0.001;
    }

    isHorizontal(compareTo: IWrapGridObject) {
        const [_, nY1] = this.getPosition();
        const [_2, nY2] = compareTo.getPosition();
        const d = nY1 - nY2;
        return d > -0.001 && d < 0.001;
    }

    isDiagonal(compareTo: IWrapGridObject) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        const dX = Math.abs(nX1 - nX2);
        const dY = Math.abs(nY1 - nY2);
        return dX === dY;
    }

    isInline(compareTo: IWrapGridObject, lapping = 0.5) {
        return this.getDistance(compareTo) <= lapping;
    }

    isAdjacent(compareTo: IWrapGridObject) {
        const d = this.getDistance(compareTo);
        return d > 0.499 && d < 1.001;
    }

    isWindow(compareTo: IWrapGridObject, distance = 1.8) {
        return this.getDistance(compareTo) > distance;
    }

    isSlantedWindow(compareTo: IWrapGridObject) {
        return (
            this.isWindow(compareTo) &&
            !this.isDiagonal(compareTo) &&
            !this.isHorizontal(compareTo) &&
            !this.isVertical(compareTo)
        );
    }

    isInverse() {
        return this.time > this.tailTime;
    }
}
