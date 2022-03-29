import { BaseObject } from './baseObject';
import { IBaseSlider } from '../../types/beatmap/v3/baseSlider';
import { ICoordinateNote } from '../../types/beatmap/shared/coordinate';

/** Base slider beatmap object. */
export abstract class BaseSlider<T extends IBaseSlider>
    extends BaseObject<T>
    implements ICoordinateNote<BaseSlider<T>>
{
    /** Color type `<int>` of base slider.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    get color() {
        return this.data.c;
    }
    set color(value: IBaseSlider['c']) {
        this.data.c = value;
    }

    /** Head position x `<int>` of base slider.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    get posX() {
        return this.data.x;
    }
    set posX(value: IBaseSlider['x']) {
        this.data.x = value;
    }

    /** Head position y `<int>` of base slider.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get posY() {
        return this.data.y;
    }
    set posY(value: IBaseSlider['y']) {
        this.data.y = value;
    }

    /** Head cut direction `<int>` of base slider.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended, assumes down-directional.
     */
    get direction() {
        return this.data.d;
    }
    set direction(value: IBaseSlider['d']) {
        this.data.d = value;
    }

    /** Tail beat time `<float>` of base slider. */
    get tailTime() {
        return this.data.tb;
    }
    set tailTime(value: number) {
        this.data.tb = value;
    }

    /** Tail position x `<int>` of base slider.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `none`
     */
    get tailPosX() {
        return this.data.tx;
    }
    set tailPosX(value: IBaseSlider['tx']) {
        this.data.tx = value;
    }

    /** Tail position y `<int>` of base slider.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get tailPosY() {
        return this.data.ty;
    }
    set tailPosY(value: IBaseSlider['ty']) {
        this.data.ty = value;
    }

    setColor(value: IBaseSlider['c']) {
        this.color = value;
        return this;
    }
    setPosX(value: IBaseSlider['x']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IBaseSlider['y']) {
        this.posY = value;
        return this;
    }
    setDirection(value: IBaseSlider['d']) {
        this.direction = value;
        return this;
    }
    setTailTime(value: number) {
        this.tailTime = value;
        return this;
    }
    setTailPosX(value: IBaseSlider['tx']) {
        this.tailPosX = value;
        return this;
    }
    setTailPosY(value: IBaseSlider['ty']) {
        this.tailPosY = value;
        return this;
    }

    /** Get slider note and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const sliderPos = slider.getPosition();
     * ```
     */
    getPosition(): [number, number] {
        // if (slider._customData?._position) {
        //     return [slider._customData._position[0], slider._customData._position[1]];
        // }
        return [
            (this.posX <= -1000
                ? this.posX / 1000
                : this.posX >= 1000
                ? this.posX / 1000
                : this.posX) - 2,
            this.posY <= -1000
                ? this.posY / 1000
                : this.posY >= 1000
                ? this.posY / 1000
                : this.posY,
        ];
    }

    /** Get two slider notes and return the distance between two slider notes.
     * ```ts
     * const sliderDistance = slider.distance(sliderCompare);
     * ```
     */
    getDistance(compareTo: BaseSlider<T>) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
    }

    /** Compare two slider notes and return if the slider notes is in vertical alignment.
     * ```ts
     * if (slider.isVertical(sliderCompare)) {}
     * ```
     */
    isVertical(compareTo: BaseSlider<T>) {
        const [nX1] = this.getPosition();
        const [nX2] = compareTo.getPosition();
        const d = nX1 - nX2;
        return d > -0.001 && d < 0.001;
    }

    /** Compare two slider notes and return if the slider notes is in horizontal alignment.
     * ```ts
     * if (slider.isHorizontal(sliderCompare)) {}
     * ```
     */
    isHorizontal(compareTo: BaseSlider<T>) {
        const [_, nY1] = this.getPosition();
        const [_2, nY2] = compareTo.getPosition();
        const d = nY1 - nY2;
        return d > -0.001 && d < 0.001;
    }

    /** Compare two slider notes and return if the slider notes is in diagonal alignment.
     * ```ts
     * if (slider.isDiagonal(sliderCompare)) {}
     * ```
     */
    isDiagonal(compareTo: BaseSlider<T>) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        const dX = Math.abs(nX1 - nX2);
        const dY = Math.abs(nY1 - nY2);
        return dX === dY;
    }

    /** Compare two slider notes and return if the slider notes is an inline.
     * ```ts
     * if (slider.isInline(sliderCompare)) {}
     * ```
     */
    isInline(compareTo: BaseSlider<T>, lapping = 0.5) {
        return this.getDistance(compareTo) <= lapping;
    }

    /** Compare two slider notes and return if the slider notes is adjacent.
     * ```ts
     * if (slider.isAdjacent(sliderCompare)) {}
     * ```
     */
    isAdjacent(compareTo: BaseSlider<T>) {
        const d = this.getDistance(compareTo);
        return d > 0.499 && d < 1.001;
    }

    /** Compare two slider notes and return if the slider notes is a window.
     * ```ts
     * if (slider.isWindow(sliderCompare)) {}
     * ```
     */
    isWindow(compareTo: BaseSlider<T>, distance = 1.8) {
        return this.getDistance(compareTo) > distance;
    }

    /** Compare two slider notes and return if the slider notes is a slanted window.
     * ```ts
     * if (slider.isSlantedWindow(sliderCompare)) {}
     * ```
     */
    isSlantedWindow(compareTo: BaseSlider<T>) {
        return (
            this.isWindow(compareTo) &&
            !this.isDiagonal(compareTo) &&
            !this.isHorizontal(compareTo) &&
            !this.isVertical(compareTo)
        );
    }

    isInverse() {
        return this.time < this.tailTime;
    }

    abstract mirror(): this;
}
