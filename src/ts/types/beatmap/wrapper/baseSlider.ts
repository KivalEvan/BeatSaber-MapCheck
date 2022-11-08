import { IWrapBaseNote } from './baseNote';

export interface IWrapBaseSlider extends IWrapBaseNote {
    /** Tail beat time `<float>` of base slider. */
    tailTime: number;
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
    tailPosX: number;
    /** Tail position y `<int>` of base slider.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    tailPosY: number;

    setDirection(value: number): this;
    setTailTime(value: number): this;
    setTailPosX(value: number): this;
    setTailPosY(value: number): this;
}