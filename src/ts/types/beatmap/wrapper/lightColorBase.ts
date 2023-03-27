import { IWrapBaseObject, IWrapBaseObjectAttribute } from './baseObject';

export interface IWrapLightColorBaseAttribute<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseObjectAttribute<T> {
    /** Relative beat time `<float>` to event box group. */
    time: number;
    /** Transition type `<int>` of base light color.
     * ```ts
     * 0 -> Instant
     * 1 -> Interpolate
     * 2 -> Extend
     * ```
     */
    transition: 0 | 1 | 2;
    /** Color `<int>` of base light color.
     * ```ts
     * -1 -> None
     * 0 -> Red
     * 1 -> Blue
     * 2 -> White
     * ```
     */
    color: -1 | 0 | 1 | 2;
    /** Brightness `<float>` of base light color.
     *
     * Range: `0-1` (0% to 100%), can be more than 1.
     */
    brightness: number;
    /** Frequency `<int>` of base light color.
     *
     * Blinking frequency in beat time of the event, `0` is static.
     */
    frequency: number;
}

export interface IWrapLightColorBase<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends IWrapBaseObject<T>,
        IWrapLightColorBaseAttribute<T> {
    setTime(value: number): this;
    setTransition(value: 0 | 1 | 2): this;
    setColor(value: 0 | 1 | 2): this;
    setBrightness(value: number): this;
    setFrequency(value: number): this;
}
