import { BaseObject } from './baseObject';
import { IBaseSlider } from '../../types/beatmap/v3/baseSlider';

/** Base slider beatmap object. */
export abstract class BaseSlider<T extends IBaseSlider> extends BaseObject<T> {
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

    isInverse() {
        return this.time < this.tailTime;
    }

    hasDot() {
        return this.direction === 8;
    }

    abstract mirror(): this;
}
