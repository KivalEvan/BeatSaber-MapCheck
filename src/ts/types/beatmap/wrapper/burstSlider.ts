import { IWrapBaseSlider } from './baseSlider';

export interface IWrapBurstSlider extends IWrapBaseSlider {
    /** Slice count or element `<int>` in burst slider.
     *
     * **NOTE:** Must be more than `0`, the head counts as `1`.
     */
    sliceCount: number;
    /** Length multiplier `<float>` of element in burst slider.
     * ```ts
     * 1 -> Normal length
     * 0.5 -> Half length
     * 0.25 -> Quarter length
     * ```
     * **WARNING:** Value `0` will crash the game.
     */
    squish: number;

    setSliceCount(value: number): this;
    setSquish(value: number): this;
}
