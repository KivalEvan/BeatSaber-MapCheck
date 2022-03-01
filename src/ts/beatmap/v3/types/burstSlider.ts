import { BaseSlider } from './baseSlider';

/** Burst slider beatmap object. */
export interface BurstSlider extends BaseSlider {
    /** Slice count or element `<int>` in burst slider. */
    sc: number;
    /** Squish amount `<float>` of element in burst slider. */
    s: number;
}
