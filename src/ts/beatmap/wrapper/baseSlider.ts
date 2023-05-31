import { LINE_COUNT, NoteDirectionAngle } from '../shared/constants';
import { IWrapBaseSlider } from '../../types/beatmap/wrapper/baseSlider';
import { IWrapGridObject } from '../../types/beatmap/wrapper/gridObject';
import { WrapBaseNote } from './baseNote';
import { ModType } from '../../types/beatmap/shared/modCheck';
import { Vector2 } from '../../types/vector';

/** Base slider beatmap class object. */
export abstract class WrapBaseSlider<T extends { [P in keyof T]: T[P] }>
    extends WrapBaseNote<T>
    implements IWrapBaseSlider<T>
{
    protected _tailTime!: IWrapBaseSlider['tailTime'];
    protected _tailPosX!: IWrapBaseSlider['tailPosX'];
    protected _tailPosY!: IWrapBaseSlider['tailPosY'];

    get tailTime(): IWrapBaseSlider['tailTime'] {
        return this._tailTime;
    }
    set tailTime(value: IWrapBaseSlider['tailTime']) {
        this._tailTime = value;
    }
    get tailPosX(): IWrapBaseSlider['tailPosX'] {
        return this._tailPosX;
    }
    set tailPosX(value: IWrapBaseSlider['tailPosX']) {
        this._tailPosX = value;
    }
    get tailPosY(): IWrapBaseSlider['tailPosY'] {
        return this._tailPosY;
    }
    set tailPosY(value: IWrapBaseSlider['tailPosY']) {
        this._tailPosY = value;
    }

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

    getTailPosition(_type?: ModType): Vector2 {
        return [this.tailPosX - 2, this.tailPosY];
    }

    /** Get arc and return standardised note angle.
     * ```ts
     * const arcAngle = arc.getAngle();
     * ```
     */
    getAngle(_type?: ModType) {
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
